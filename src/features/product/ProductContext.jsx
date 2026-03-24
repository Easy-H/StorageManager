import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../../common/api/firebase/firebase.js'; // 설정된 firebase 불러오기
import { FirebaseProductRepository as ProductAPI } from './api/FirebaseProductRepository';

const ProductContext = createContext();

export const ProductProvider = ({ orgId, children }) => {

	return (
		<ProductContext.Provider value={{  }}>
			{children}
		</ProductContext.Provider>
	);
};

export const useProducts = () => useContext(ProductContext);