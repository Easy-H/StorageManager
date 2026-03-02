import { initializeApp } from "firebase/app";
import { getFirestore, runTransaction, doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZEJ2RCpKc3ZYO8yjKyTk6PaMgOXzewk8",
  authDomain: "storagemanager-6344f.firebaseapp.com",
  projectId: "storagemanager-6344f",
  storageBucket: "storagemanager-6344f.firebasestorage.app",
  messagingSenderId: "320610344139",
  appId: "1:320610344139:web:52036c32016ffd6bbf4f4e",
  measurementId: "G-YE15BHZL3E"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

export { db }