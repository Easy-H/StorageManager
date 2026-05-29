import { StyleSheet, Text, View } from 'react-native';
import { H3 } from '../../../common/components/ui/react-native/common';
import { Box } from '../../../common/components/ui/react-native/custom';

const RecentActivityLog = ({ logs }) => {
	return (
		<>
			<H3>🕒 최근 활동</H3>
			<Box style={{ padding: 0 }}>
				{logs.length > 0 ? (
					logs.map((log, index) => (
						<View key={log.id} style={[
							localStyles.logRow,
							index !== logs.length - 1 && localStyles.borderBottom
						]}>
							<View>
								<Text style={{ fontSize: 14, fontWeight: '500' }}>{log.productName}</Text>
								<Text style={{ fontSize: 11, color: '#999' }}>
									{log.timestamp?.toLocaleString('ko-KR', { hour12: false })}
								</Text>
							</View>
							<Text style={[
								localStyles.changeQty,
								{ color: log.type === 'IN' ? '#52c41a' : log.type === 'OUT' ? '#ff4d4f' : '#1890ff' }
							]}>
								{log.type === 'IN' ? `+${log.changeQty}` : log.type === 'OUT' ? `${log.changeQty}` : '기록'}
							</Text>
						</View>
					))
				) : (
					<Text style={{ padding: 30, textAlign: 'center', color: '#999', fontSize: 13 }}>기록이 없습니다.</Text>
				)}
			</Box>
		</>
	);
};

const localStyles = StyleSheet.create({
	logRow: {
		paddingHorizontal: 15, paddingVertical: 12,
		display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
	},
	borderBottom: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5', borderBottomStyle: 'solid' },
	changeQty: { textAlign: 'right', fontSize: 13, fontWeight: 'bold' }
});

export default RecentActivityLog;