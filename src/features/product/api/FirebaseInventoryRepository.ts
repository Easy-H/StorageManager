import {
	collection,
	doc,
	runTransaction,
	serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../common/api/firebase/firebase';
import { StockUpdateItem, StockUpdateType } from '../types';

/**
 * 재고 트랜잭션 및 로그 처리를 담당하는 레포지토리
 */
export const FirebaseInventoryRepository = {
	// [U] 개별 재고 수량 업데이트 (트랜잭션 적용)
	updateStock: async (
		orgId: string, 
		productId: string, 
		inputQty: number | string, 
		isDirectInput: boolean, 
		type: string,
		userEmail?: string
	): Promise<void> => {
		if (!orgId || !productId) throw new Error("필수 정보가 부족합니다.");

		const docRef = doc(db, "organizations", orgId, "products", productId);
		const logColRef = collection(db, "organizations", orgId, "inventory_logs");

		await runTransaction(db, async (transaction) => {
			const productSnap = await transaction.get(docRef);
			if (!productSnap.exists()) throw new Error("상품이 존재하지 않습니다.");

			const productData = productSnap.data();
			const currentStock = productData.currentStock || 0;
			const productName = productData.name;
			const change = Number(inputQty);

			let newStock;
			if (isDirectInput) {
				newStock = change;
			} else if (type === 'IN') {
				newStock = currentStock + change;
			} else {
				newStock = currentStock - change;
			}

			transaction.update(docRef, {
				currentStock: newStock,
				lastAudit: serverTimestamp(),
				updatedAt: serverTimestamp()
			});

			const newLogRef = doc(logColRef);
			transaction.set(newLogRef, {
				productId: productId,
				productName: productName,
				type: type,
				changeQty: isDirectInput ? (newStock - currentStock) : (type === 'IN' ? change : -change),
				finalStock: newStock,
				timestamp: serverTimestamp(),
				userEmail: userEmail || "system"
			});
		});
	},

	// [U] 일괄 재고 업데이트 (Todo 실행 시)
	updateStocks: async (
		orgId: string, 
		items: StockUpdateItem[], 
		type: StockUpdateType, 
		todoId: string,
		userEmail?: string
	): Promise<void> => {
		if (!orgId || !items.length) throw new Error("데이터가 부족합니다.");

		await runTransaction(db, async (transaction) => {
			const logColRef = collection(db, "organizations", orgId, "inventory_logs");
			const todoRef = doc(db, "organizations", orgId, "todos", todoId);

			const productRefs = items.map(item => doc(db, "organizations", orgId, "products", item.productId));
			const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref as any)));

			const updates: { ref: any; newStock: number }[] = [];
			const logs: any[] = [];

			for (let i = 0; i < items.length; i++) {
				const snap = productSnaps[i];
				if (!snap.exists()) throw new Error(`품목을 찾을 수 없습니다: ${items[i].name}`);

				const data = snap.data() as any;
				const currentStock = data.currentStock || 0;
				const change = Number(items[i].quantity);
				const newStock = type === 'IN' ? currentStock + change : currentStock - change;

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

			updates.forEach(({ ref, newStock }) => {
				transaction.update(ref, {
					currentStock: newStock,
					updatedAt: serverTimestamp(),
					lastAudit: serverTimestamp()
				});
			});

			logs.forEach(logData => {
				const newLogRef = doc(logColRef);
				transaction.set(newLogRef, { 
					...logData, 
					timestamp: serverTimestamp(), 
					todoId,
					userEmail: userEmail || "system"
				});
			});

			transaction.update(todoRef, { status: 'executed', executedAt: serverTimestamp() });
		});
	},

	// [U] 일괄 재고 취소 (Undo 시)
	undoStocks: async (orgId: string, items: StockUpdateItem[], originalType: StockUpdateType, todoId: string, userEmail?: string): Promise<void> => {
		await runTransaction(db, async (transaction) => {
			const todoRef = doc(db, "organizations", orgId, "todos", todoId);
			const logColRef = collection(db, "organizations", orgId, "inventory_logs");
			const productRefs = items.map(item => doc(db, "organizations", orgId, "products", item.productId));
			const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref as any)));

			for (let i = 0; i < items.length; i++) {
				const data = productSnaps[i].data() as any;
				const currentStock = data.currentStock || 0;
				const change = Number(items[i].quantity);
				const undoChange = originalType === 'IN' ? -change : change;
				const newStock = currentStock + undoChange;

				if (newStock < 0) throw new Error(`[취소 불가] '${items[i].name}' (현재 재고 부족)`);

				transaction.update(productRefs[i], { currentStock: newStock, updatedAt: serverTimestamp() });
				const newLogRef = doc(logColRef);
				transaction.set(newLogRef, { productId: items[i].productId, productName: items[i].name, type: `UNDO_${originalType}`, changeQty: undoChange, finalStock: newStock, timestamp: serverTimestamp(), todoId, isUndo: true, userEmail: userEmail || "system" });
			}
			transaction.update(todoRef, { status: 'pending', executedAt: null });
		});
	},
};