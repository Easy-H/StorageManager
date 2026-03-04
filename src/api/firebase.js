import { initializeApp } from "firebase/app";
import { getFirestore, runTransaction, doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

// 재고 이벤트 처리 함수 (핵심 로직)
export const processInventoryEvent = async (barcode, type, qty = 1, userId = "user1") => {
  const productRef = doc(db, "products", barcode);
  const eventRef = collection(db, "events");

  try {
    await runTransaction(db, async (transaction) => {
      const pDoc = await transaction.get(productRef);
      if (!pDoc.exists()) throw "상품이 존재하지 않습니다.";

      const newStock = type === 'IN' ? pDoc.data().currentStock + qty : pDoc.data().currentStock - qty;

      // 1. 상품 정보 업데이트
      transaction.update(productRef, {
        currentStock: newStock,
        lastEventAt: serverTimestamp(),
        ...(type === 'CHECK' && { lastCheckedAt: serverTimestamp() })
      });

      // 2. 이벤트 로그 추가
      await addDoc(eventRef, {
        productId: barcode,
        type: type,
        quantity: qty,
        user: userId,
        timestamp: serverTimestamp()
      });
    });
    return true;
  } catch (e) {
    console.error("Transaction failed: ", e);
    return false;
  }
};

export { db, auth }