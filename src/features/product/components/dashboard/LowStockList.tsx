import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { H3 } from '../../../../common/components/ui/react-native/common';
import { Box } from '../../../../common/components/ui/react-native/custom';

interface LowStockItem {
	id: string;
	name: string;
	currentStock: number;
	safetyStock: number;
}

interface LowStockListProps {
	items: LowStockItem[];
}

const LowStockList = ({ items }: LowStockListProps) => {
	return (
		<>
			<H3>🚨 발주 필요 품목</H3>
			<Box>
				{items && items.length > 0 ? (
					<View style={{ flexDirection: 'column', gap: 10 } as ViewStyle}>
						{items.map(item => (
							<View key={item.id} style={localStyles.itemRow}>
								<Text style={{ fontSize: 14, fontWeight: '500' } as TextStyle}>{item.name}</Text>
								<Text style={{ fontSize: 12, color: '#cf1322' } as TextStyle}>
									현재: <Text style={{ fontWeight: 'bold' } as TextStyle}>{item.currentStock}</Text> / 기준: {item.safetyStock}
								</Text>
							</View>
						))}
						<Text style={{ fontSize: 12, color: '#999', marginTop: 5 } as TextStyle}>* 안전 재고 기준보다 낮거나 같은 품목입니다.</Text>
					</View>
				) : (
					<Text style={{ fontSize: 14, color: '#52c41a' } as TextStyle}>✅ 모든 품목의 재고가 충분합니다.</Text>
				)}
			</Box>
		</>
	);
};

const localStyles = StyleSheet.create({
	itemRow: {
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center',
		padding: 10, 
		backgroundColor: '#fff1f0', 
		borderRadius: 8, 
		borderWidth: 1, 
		borderColor: '#ffa39e'
	} as ViewStyle
});

export default LowStockList;