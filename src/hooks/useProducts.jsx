import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useProducts(orgId) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!orgId) {
      setProducts([]);
      return;
    }
    const q = query(collection(db, "products"), where("orgId", "==", orgId));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [orgId]);

  return products;
}