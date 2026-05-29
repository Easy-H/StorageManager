import { StyleSheet, Text, View } from 'react-native';
import { Box } from '../../../common/components/ui/react-native/custom';
import { H3 } from '../../../common/components/ui/react-native/common';

const LowStockList = ({ items }) => {
	return (
		<>
			<H3>🚨 발주 필요 품목</H3>
			<Box>
				{items.length > 0 ? (
					<View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						{items.map(item => (
							<View key={item.id} style={localStyles.itemRow}>
								<Text style={{ fontSize: 14, fontWeight: '500' }}>{item.name}</Text>
								<Text style={{ fontSize: 12, color: '#cf1322' }}>
									현재: <Text style={{ fontWeight: 'bold' }}>{item.currentStock}</Text> / 기준: {item.safetyStock}
								</Text>
							</View>
						))}
						<Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>* 안전 재고 기준보다 낮거나 같은 품목입니다.</Text>
					</View>
				) : (
					<Text style={{ fontSize: 14, color: '#52c41a', margin: 0 }}>✅ 모든 품목의 재고가 충분합니다.</Text>
				)}
			</Box>
		</>
	);
};

const localStyles = StyleSheet.create({
	itemRow: {
		display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
		padding: 10, background: '#fff1f0', borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#ffa39e'
	}
});

export default LowStockList;