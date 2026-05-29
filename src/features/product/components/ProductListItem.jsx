import { Text, View } from 'react-native';
import { ListItem } from '../../../common/components/ui/react-native/custom/index.js';

const ProductListItem = ({ product, auditStatus, onClick }) => {
	const isLow = product.currentStock <= (product.safetyStock || 0);

	return (
		<ListItem onClick={() => onClick(product)}>
			<View style={{ flex: 1 }}>
				<View style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
					<Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{product.name}</Text>
					<Text style={{ 
						fontSize: '10px', color: auditStatus.color, 
						backgroundColor: auditStatus.bg, padding: '2px 5px', borderRadius: '4px' 
					}}>
						{auditStatus.text}
					</Text>
				</View>
				<Text style={{ fontSize: '12px', color: '#999' }}>{product.barcode || "N/A"}</Text>
			</View>
			<View style={{ alignItems: 'flex-end' }}>
				<Text style={{ 
					fontSize: '18px', fontWeight: 'bold', color: isLow ? '#ff4d4f' : '#333' 
				}}>
					{product.currentStock}개
				</Text>
				{isLow && <Text style={{ fontSize: '10px', color: '#ff4d4f', fontWeight: 'bold' }}>재고부족</Text>}
			</View>
		</ListItem>
	);
};

export default ProductListItem;