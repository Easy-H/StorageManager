import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

/**
 * 조직(Organization) 하위 컬렉션 구조를 사용하는 Firebase 구현체
 * 경로: /organizations/{orgId}/products/{productId}
 * 경로: /organizations/{orgId}/inventory_logs/{logId}
 */
export const FirebaseProductRepository = {

  // [C/U] 제품 저장 및 수정
  saveItem: async (orgId, item, formData, initialQty) => {
    if (!orgId) throw new Error("조직 ID가 필요합니다.");

    const isEdit = !!(item && item.id);
    const colRef = collection(db, "organizations", orgId, "products");
    const docRef = isEdit
      ? doc(db, "organizations", orgId, "products", item.id)
      : doc(colRef);

    // 1. 공통 데이터 (이름, 카테고리 등)
    const data = {
      ...formData,
      updatedAt: serverTimestamp(),
    };

    // 2. 신규 등록 시에만 초기 재고와 생성일 설정
    if (!isEdit) {
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

  // [U] 재고 수량 업데이트 (입고/출고/직접수정) + 로그 기록
  updateStock: async (orgId, item, inputQty, isDirectInput, type) => {
    if (!orgId || !item.id) throw new Error("조직 ID와 상품 정보가 필요합니다.");

    const docRef = doc(db, "organizations", orgId, "products", item.id);
    const logColRef = collection(db, "organizations", orgId, "inventory_logs");

    const change = Number(inputQty);

    let newStock;

    if (isDirectInput) {
      newStock = change
    }
    else if (type === 'IN') {
      newStock = item.currentStock + change;
    }
    else {
      newStock = item.currentStock - change;
    }

    // 원자적 처리를 위해 Batch 사용 (권장)
    const batch = writeBatch(db);

    // 1. 상품 재고 업데이트
    batch.update(docRef, {
      currentStock: newStock,
      lastAudit: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 2. 로그 기록 (해당 조직의 하위 로그 컬렉션)
    const newLogRef = doc(logColRef);
    batch.set(newLogRef, {
      productId: item.id,
      productName: item.name,
      type: type, // 'IN', 'OUT', 'ADJUST', 'CREATE' 등
      changeQty: isDirectInput ? (newStock - item.currentStock) : change,
      finalStock: newStock,
      timestamp: serverTimestamp(),
      userEmail: "" // 필요한 경우 현재 유저 이메일 추가 가능
    });

    await batch.commit();
  },

  // [D] 제품 삭제
  deleteItem: async (orgId, item) => {
    if (!orgId || !item.id) throw new Error("삭제를 위한 정보가 부족합니다.");
    const docRef = doc(db, "organizations", orgId, "products", item.id);
    await deleteDoc(docRef);
  },

  // [U] 실사 확인 기록 (수량 변동 없이 감사 일시만 업데이트)
  auditItem: async (orgId, item) => {
    if (!orgId || !item.id) return;
    const docRef = doc(db, "organizations", orgId, "products", item.id);
    await updateDoc(docRef, {
      lastAudit: serverTimestamp()
    });
  },
  subscribeProducts: (orgId, callback) => {
    if (!orgId) return () => { };

    const q = query(
      collection(db, "organizations", orgId, "products"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // ✨ Timestamp를 Date 객체로 변환
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          lastAudit: data.lastAudit?.toDate ? data.lastAudit.toDate() : data.lastAudit,
        };
      });
      callback(products);
    }, (error) => {
      console.error("제품 구독 에러:", error);
    });
  },

  // [R/Realtime] 최근 활동 로그 5개 실시간 구독
  subscribeRecentLogs: (orgId, callback) => {
    if (!orgId) return () => { };

    const q = query(
      collection(db, "organizations", orgId, "inventory_logs"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // ✨ 로그의 타임스탬프 변환
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp,
        };
      });
      callback(logs);
    });
  },

  // [R] 전체 로그 가져오기
  getAllLogs: async (orgId) => {
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
      };
    });
  },
};