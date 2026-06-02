import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import { db } from '../../../common/api/firebase/firebase';
import { InventoryLog, Product } from '../types';

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