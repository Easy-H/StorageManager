import { useState, useEffect } from 'react';
// 구현체인 FirebaseProductRepository를 Repository라는 이름으로 가져옵니다.
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';

export function useProducts(orgId) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!orgId) {
      setProducts([]);
      return;
    }

    // Repository에게 구독을 요청하고, 데이터가 오면 state를 업데이트합니다.
    const unsubscribe = Repository.subscribeProducts(orgId, (data) => {
      setProducts(data);
    });

    // 클린업 함수: 컴포넌트 언마운트 시 리스너 해제
    return unsubscribe;
  }, [orgId]);

  return products;
}