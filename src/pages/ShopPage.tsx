import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { H2, H3 } from '../common/components/ui/react-native/common';
import { Box } from '../common/components/ui/react-native/custom';
import { Product } from '../features/product/types';
import { OrgMembership } from '../features/org/types';
import { styles, Colors } from '../styles';
import { vars } from '../common/components/ui';

interface ShopPageProps {
	products: Product[];
	currentOrg: OrgMembership;
	onBack: () => void;
	notice: (msg: string) => void;
}

const ShopPage = ({ products, currentOrg, notice }: ShopPageProps) => {
	// 판매 중인 상품만 필터링
	const saleProducts = products.filter(p => p.isForSale);

	return (
		<ScrollView contentContainerStyle={styles.appContent}>
			<View style={localStyle.header}>
				<H2>🛍️ {currentOrg.name} 상점</H2>
				<Text style={localStyle.subtitle}>공개된 판매 품목을 확인하세요.</Text>
			</View>

			<H3>🔥 판매 중인 상품 ({saleProducts.length})</H3>
			
			{saleProducts.length > 0 ? (
				saleProducts.map(product => (
					<Box key={product.id} style={localStyle.productCard}>
						<View>
							<Text style={localStyle.productName}>{product.name}</Text>
							<Text style={localStyle.price}>{product.price?.toLocaleString() || 0}원</Text>
						</View>
						<Text style={{ color: '#888', fontSize: 12 }}>재고: {product.currentStock}</Text>
					</Box>
				))
			) : (
				<Text style={localStyle.emptyText}>현재 판매 중인 상품이 없습니다.</Text>
			)}
		</ScrollView>
	);
};

const localStyle = StyleSheet.create({
	header: { marginBottom: 20 } as ViewStyle,
	subtitle: { fontSize: 14, color: '#666', marginTop: 4 } as TextStyle,
	productCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } as ViewStyle,
	productName: { fontSize: 16, fontWeight: 'bold', color: vars.primary } as TextStyle,
	price: { fontSize: 14, color: vars.text, fontWeight: '600', marginTop: 2 } as TextStyle,
	emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 } as TextStyle,
});

export default ShopPage;