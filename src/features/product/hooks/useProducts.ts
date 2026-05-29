import { useState, useEffect } from 'react';
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';
import { Product } from '../types';

export function useProducts(orgId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!orgId) {
      setProducts([]);
      return;
    }

    const unsubscribe = Repository.subscribeProducts(orgId, (data) => {
      setProducts(data);
    });

    return unsubscribe;
  }, [orgId]);

  return products;
}