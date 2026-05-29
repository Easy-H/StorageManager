import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirebaseProductRepository as ProductAPI } from '../api/FirebaseProductRepository';
import { Product } from '../types';

type ProductContextType = {
	products: Product[];
	loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
	orgId?: string;
	children: ReactNode;
}

export const ProductProvider = ({ orgId, children }: ProductProviderProps) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!orgId) {
			setProducts([]);
			setLoading(false);
			return;
		}

		const unsubscribe = ProductAPI.subscribeProducts(orgId, (data) => {
			setProducts(data);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [orgId]);

	return (
		<ProductContext.Provider value={{ products, loading }}>
			{children}
		</ProductContext.Provider>
	);
};

export const useProductContext = () => {
	const context = useContext(ProductContext);
	if (context === undefined) {
		throw new Error('useProductContext must be used within a ProductProvider');
	}
	return context;
};