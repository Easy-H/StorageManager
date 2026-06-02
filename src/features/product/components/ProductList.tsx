import { FlatList, StyleSheet, Text } from 'react-native';

import FilterHeader from '../../../common/components/ui-brick/react-native/custom/FilterHeader';

import { useProductManagement } from '../hooks/useProductManagement';
import { Product } from '../types';
import { getAuditStatus } from '../utils/auditUtils';

import ProductListItem from './ProductListItem';

type ProductListProps = {
	products: Product[];
	searchTerm: string;
	onSelectProduct: (product: Product) => void;
}

const ProductList = ({ products, searchTerm, onSelectProduct }: ProductListProps) => {
	const { 
		displayList, counts, 
		sortBy, setSortBy, 
		filterType, setFilterType 
	} = useProductManagement(products, searchTerm);

	const tabs = [
		{ label: "전체", value: "ALL", count: counts.ALL },
		{ label: "⚠️ 부족", value: "LOW_STOCK", count: counts.LOW_STOCK },
		{ label: "✅ 점검", value: "NEEDS_INSPECTION", count: counts.NEEDS_INSPECTION },
		{ label: "📅 실사", value: "NEEDS_AUDIT", count: counts.NEEDS_AUDIT },
	];

	const sortOptions = [
		{ label: "🔤 이름순", value: "name" },
		{ label: "⚠️ 부족순", value: "lowStock" },
		{ label: "📅 과거순", value: "oldAudit" },
	];

	return (
		<>
			<FilterHeader
				tabs={tabs}
				activeTab={filterType}
				onTabChange={setFilterType}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortOptions={sortOptions}
			/>

			<FlatList
				data={displayList}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ProductListItem 
						product={item} 
						auditStatus={getAuditStatus(item.lastAudit)} 
						onPress={onSelectProduct} 
					/>
				)}
				ListEmptyComponent={() => (
					<Text style={localStyles.emptyText}>조건에 맞는 제품이 없습니다.</Text>
				)}
				showsVerticalScrollIndicator={false}
				style={localStyles.productList}
			/>
		</>
	);
};

const localStyles = StyleSheet.create({
	productList: {
		flex: 1
	},
	emptyText: {
		textAlign: 'center',
		color: '#999',
		marginTop: 40
	}
});

export default ProductList;