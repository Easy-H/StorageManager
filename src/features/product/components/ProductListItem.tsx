import { StyleSheet, Text, View } from 'react-native';
import { ListItem, vars } from '../../../common/components/ui-brick';
import { Product } from '../types';

type ProductListItemProps = {
	product: Product;
	auditStatus: {
		color: string;
		bg: string;
		text: string;
	};
	onPress: (product: Product) => void;
}

const ProductListItem = ({ product, auditStatus, onPress }: ProductListItemProps) => {
	const isLow = product.currentStock <= (product.safetyStock || 0);

	return (
		<ListItem onPress={() => onPress(product)}>
			<View style={localStyles.infoContainer}>
				<View style={localStyles.nameRow}>
					<Text style={localStyles.productName}>{product.name}</Text>
					<Text style={[
						localStyles.auditBadge, 
						{ color: auditStatus.color, backgroundColor: auditStatus.bg }
					]}>
						{auditStatus.text}
					</Text>
				</View>
				<Text style={localStyles.barcode}>{product.barcode || "N/A"}</Text>
			</View>
			<View style={localStyles.stockContainer}>
				<Text style={[
					localStyles.stockText, 
					{ color: isLow ? vars.errorRed : vars.text }
				]}>
					{product.currentStock}개
				</Text>
				{isLow && <Text style={localStyles.lowStockLabel}>재고부족</Text>}
			</View>
		</ListItem>
	);
};

const localStyles = StyleSheet.create({
	infoContainer: {
		flex: 1,
	},
	nameRow: {
		alignItems: 'center',
		gap: 8,
		flexDirection: 'row',
	},
	productName: {
		color: vars.text,
		fontSize: 16,
		fontWeight: 'bold',
	},
	auditBadge: {
		fontSize: 10,
		paddingVertical: 2,
		paddingHorizontal: 5,
		borderRadius: 4,
		overflow: 'hidden', // iOS에서 배경색 둥근 모서리 적용을 위해 필요
	},
	barcode: {
		fontSize: 12,
		color: '#999',
	},
	stockContainer: {
		alignItems: 'flex-end',
	},
	stockText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	lowStockLabel: {
		fontSize: 10,
		color: vars.errorRed,
		fontWeight: 'bold',
	},
});

export default ProductListItem;