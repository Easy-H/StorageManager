import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import { db } from '../../../common/api/firebase/firebase';
import { InventoryLog, Product, StockUpdateItem, StockUpdateType } from '../types';

/**
 * 조직(Organization) 하위 컬렉션 구조를 사용하는 Firebase 구현체
 * 경로: /organizations/{orgId}/products/{productId}
 * 경로: /organizations/{orgId}/inventory_logs/{logId}
 */
export const FirebaseProductRepository = {

	// [C/U] 제품 저장 및 수정
	saveItem: async (orgId: string, itemId: string | null, formData: any, initialQty?: number | string): Promise<string> => {
		if (!orgId) throw new Error("조직 ID가 필요합니다.");

		const isEdit = !!(itemId);
		const colRef = collection(db, "organizations", orgId, "products");
		const docRef = isEdit
			? doc(db, "organizations", orgId, "products", itemId)
			: doc(colRef);
		if (formData.initialStock) {
			initialQty = formData.initialStock;
			delete (formData.initialStock);
		}
		// 1. 공통 데이터 (이름, 카테고리 등)
		const data: any = {
			...formData,
			updatedAt: serverTimestamp(),
		};

		// 2. 신규 등록 시에만 초기 재고와 생성일 설정
		if (!isEdit && docRef) {
			data.currentStock = Number(initialQty) || 0;
			data.createdAt = serverTimestamp();

			await setDoc(docRef, data); // 신규는 setDoc
		} else {
			// 3. 수정 시에는 currentStock을 건드리지 않음
			// 💡 만약 데이터 구조상 currentStock이 필수라면, 여기서 제외하거나 
			// updateDoc을 사용하여 특정 필드만 교체합니다.
			await updateDoc(docRef, data);
		}

		return docRef.id;
	},

	// [U] 재고 수량 업데이트 (currentStock 인자 제거 + 트랜잭션 적용)
	updateStock: async (orgId: string, productId: string, inputQty: number | string, isDirectInput: boolean, type: string): Promise<void> => {
		if (!orgId || !productId) throw new Error("필수 정보가 부족합니다.");

		const docRef = doc(db, "organizations", orgId, "products", productId);
		const logColRef = collection(db, "organizations", orgId, "inventory_logs");

		// runTransaction을 통해 읽기-쓰기를 하나의 작업으로 묶습니다.
		await runTransaction(db, async (transaction) => {
			// 1. 최신 데이터 읽기 (내부에서 직접 조회)
			const productSnap = await transaction.get(docRef);
			if (!productSnap.exists()) throw new Error("상품이 존재하지 않습니다.");

			const productData = productSnap.data();
			const currentStock = productData.currentStock || 0;
			const productName = productData.name; // 기존 이름 그대로 사용
			const change = Number(inputQty);

			// 2. 새로운 재고 계산
			let newStock;
			if (isDirectInput) {
				newStock = change;
			} else if (type === 'IN') {
				newStock = currentStock + change;
			} else {
				newStock = currentStock - change;
			}

			// 3. 상품 재고 업데이트
			transaction.update(docRef, {
				currentStock: newStock,
				lastAudit: serverTimestamp(),
				updatedAt: serverTimestamp()
			});

			// 4. 로그 기록 (당시의 productName 포함)
			const newLogRef = doc(logColRef);
			transaction.set(newLogRef, {
				productId: productId,
				productName: productName, // 비정규화 유지
				type: type,
				changeQty: isDirectInput ? (newStock - currentStock) : (type === 'IN' ? change : -change),
				finalStock: newStock,
				timestamp: serverTimestamp(),
				userEmail: ""
			});
		});
	},

	updateStocks: async (orgId: string, items: StockUpdateItem[], type: StockUpdateType, todoId: string): Promise<void> => {
		if (!orgId || !items.length) throw new Error("데이터가 부족합니다.");

		await runTransaction(db, async (transaction) => {
			const logColRef = collection(db, "organizations", orgId, "inventory_logs");
			const todoRef = doc(db, "organizations", orgId, "todos", todoId);

			// 1. 모든 제품의 현재 상태를 먼저 읽음 (트랜잭션 내 Read는 항상 먼저 수행)
			const productRefs = items.map(item => doc(db, "organizations", orgId, "products", item.productId));
			const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref as any)));

			// 2. 재고 계산 및 유효성 검사
			const updates: { ref: any; newStock: number }[] = [];
			const logs: any[] = [];

			for (let i = 0; i < items.length; i++) {
				const snap = productSnaps[i];
				if (!snap.exists()) throw new Error(`품목을 찾을 수 없습니다: ${items[i].name}`);

				const data = snap.data() as any;
				const currentStock = data.currentStock || 0;
				const change = Number(items[i].quantity);
				const newStock = type === 'IN' ? currentStock + change : currentStock - change;

				// 🛑 핵심: 출고 시 재고가 부족하면 트랜잭션 전체 롤백
				if (newStock < 0) {
					throw new Error(`[재고 부족] '${items[i].name}'의 현재 재고는 ${currentStock}개입니다. (${change}개 출고 불가)`);
				}

				updates.push({ ref: productRefs[i], newStock });
				logs.push({
					productId: items[i].productId,
					productName: items[i].name,
					type: type,
					changeQty: type === 'IN' ? change : -change,
					finalStock: newStock
				});
			}

			// 3. 검증 통과 시 모든 쓰기 작업 실행
			updates.forEach(({ ref, newStock }) => {
				transaction.update(ref, {
					currentStock: newStock,
					updatedAt: serverTimestamp(),
					lastAudit: serverTimestamp()
				});
			});

			logs.forEach(logData => {
				const newLogRef = doc(logColRef);
				transaction.set(newLogRef, { ...logData, timestamp: serverTimestamp(), todoId });
			});

			transaction.update(todoRef, { status: 'executed', executedAt: serverTimestamp() });
		});
	},
	undoStocks: async (orgId: string, items: StockUpdateItem[], originalType: StockUpdateType, todoId: string): Promise<void> => {
		await runTransaction(db, async (transaction) => {
			const todoRef = doc(db, "organizations", orgId, "todos", todoId);
			const logColRef = collection(db, "organizations", orgId, "inventory_logs");

			const productRefs = items.map(item => doc(db, "organizations", orgId, "products", item.productId));
			const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref as any)));

			for (let i = 0; i < items.length; i++) {
				const data = productSnaps[i].data() as any;
				const currentStock = data.currentStock || 0;
				const change = Number(items[i].quantity);
				// 입고(IN) 취소는 재고 감소(-), 출고(OUT) 취소는 재고 증가(+)
				const undoChange = originalType === 'IN' ? -change : change;
				const newStock = currentStock + undoChange;

				if (newStock < 0) {
					throw new Error(`[취소 불가] '${items[i].name}'을(를) 이미 사용하였습니다. (현재 재고: ${currentStock}개)`);
				}

				transaction.update(productRefs[i], { currentStock: newStock, updatedAt: serverTimestamp() });

				const newLogRef = doc(logColRef);
				transaction.set(newLogRef, {
					productId: items[i].productId,
					productName: items[i].name,
					type: `UNDO_${originalType}`,
					changeQty: undoChange,
					finalStock: newStock,
					timestamp: serverTimestamp(),
					todoId,
					isUndo: true
				});
			}

			transaction.update(todoRef, { status: 'pending', executedAt: null });
		});
	},

	// [D] 제품 삭제
	deleteItem: async (orgId: string, itemId: string): Promise<void> => {
		if (!orgId || !itemId) throw new Error("삭제를 위한 정보가 부족합니다.");
		const docRef = doc(db, "organizations", orgId, "products", itemId);
		await deleteDoc(docRef);
	},

	// [U] 실사 확인 기록 (수량 변동 없이 감사 일시만 업데이트)
	auditItem: async (orgId: string, itemId: string): Promise<void> => {
		if (!orgId || !itemId) return;
		const docRef = doc(db, "organizations", orgId, "products", itemId);
		await updateDoc(docRef, {
			lastAudit: serverTimestamp()
		});
	},
	subscribeProducts: (orgId: string, callback: (products: Product[]) => void): (() => void) => {
		if (!orgId) return () => { };

		const q = query(
			collection(db, "organizations", orgId, "products"),
			orderBy("createdAt", "desc")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const products = snapshot.docs.map(doc => {
				const data = doc.data();
				return {
					id: doc.id,
					...data,
					// ✨ Timestamp를 Date 객체로 변환
					createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
					updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
					lastAudit: data.lastAudit?.toDate ? data.lastAudit.toDate() : data.lastAudit,
				} as unknown as Product;
			});
			callback(products);
		}, (error) => {
			console.error("제품 구독 에러:", error);
		});
		return unsubscribe;
	},

	// [R/Realtime] 최근 활동 로그 5개 실시간 구독
	subscribeRecentLogs: (orgId: string, callback: (logs: InventoryLog[]) => void): (() => void) => {
		if (!orgId) return () => { };

		const q = query(
			collection(db, "organizations", orgId, "inventory_logs"),
			orderBy("timestamp", "desc"),
			limit(5)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const logs = snapshot.docs.map(doc => {
				const data = doc.data();
				return {
					id: doc.id,
					...data,
					// ✨ 로그의 타임스탬프 변환
					timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
				} as unknown as InventoryLog;
			});
			callback(logs);
		});
		return unsubscribe;
	},

	// [R] 전체 로그 가져오기
	getAllLogs: async (orgId: string): Promise<InventoryLog[]> => {
		if (!orgId) return [];
		const q = query(
			collection(db, "organizations", orgId, "inventory_logs"),
			orderBy("timestamp", "desc")
		);
		const snap = await getDocs(q);
		return snap.docs.map(doc => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
			} as unknown as InventoryLog;
		});
	},
};