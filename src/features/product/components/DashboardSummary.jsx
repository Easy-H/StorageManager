import { StyleSheet, Text, View } from 'react-native';
import { H3 } from '../../../common/components/ui/react-native/common';
import { BlueButton, Box, GreenButton } from '../../../common/components/ui/react-native/custom';

const DashboardSummary = ({ lowStockCount, overdueAuditCount, onDownloadExcel, onDownloadLogs }) => {
	return (
		<>
			<H3>📌 요약</H3>
			<Box>
				<View style={localStyles.grid}>
					<View style={[localStyles.statCard, { background: '#fff7e6', borderColor: '#ffd591' }]}>
						<Text style={{ fontSize: 12, color: '#fa8c16' }}>재고 부족</Text>
						<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#d46b08' }}>
							{lowStockCount} <Text style={{ fontSize: 14 }}>건</Text>
						</Text>
					</View>
					<View style={[localStyles.statCard, { background: '#f0f5ff', borderColor: '#adc6ff' }]}>
						<Text style={{ fontSize: 12, color: '#2f54eb' }}>실사 필요</Text>
						<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1d39c4' }}>
							{overdueAuditCount} <Text style={{ fontSize: 14 }}>건</Text>
						</Text>
					</View>
					<BlueButton onPress={onDownloadExcel}>
						📦 재고현황 받기
					</BlueButton>
					<GreenButton onPress={onDownloadLogs}>
						📋 활동로그 받기
					</GreenButton>
				</View>
			</Box>
		</>
	);
};

const localStyles = StyleSheet.create({
	grid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gap: 15
	},
	statCard: {
		padding: 15,
		borderRadius: 12,
		borderWidth: 1,
		borderStyle: 'solid'
	}
});

export default DashboardSummary;