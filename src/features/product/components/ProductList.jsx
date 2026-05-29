import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useProductManagement } from '../hooks/useProductManagement';
import { getAuditStatus } from '../utils/auditUtils';
import ProductListItem from './ProductListItem';
import ProductFilterHeader from './ProductFilterHeader';

const ProductList = ({ products, searchTerm, onSelectProduct }) => {
	const { 
		displayList, counts, 
		sortBy, setSortBy, 
		filterType, setFilterType 
	} = useProductManagement(products, searchTerm);

	return (
		<>
			<View style={{ flexDirection: "row" }}>
				<ProductFilterHeader
					filterType={filterType}
					setFilterType={setFilterType}
					counts={counts}
					sortBy={sortBy}
					setSortBy={setSortBy}
				/>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} style={localStyles.productList}>
				{displayList.map(p => (
					<ProductListItem 
						key={p.id} 
						product={p} 
						auditStatus={getAuditStatus(p.lastAudit)} 
						onClick={onSelectProduct} 
					/>
				))}
				{displayList.length === 0 && (
					<Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>조건에 맞는 제품이 없습니다.</Text>
				)}
			</ScrollView>
		</>
	);
};

const localStyles = StyleSheet.create({
	productList: {
		flex: 1
	},
});

export default ProductList;