import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { H3, Box, SecondaryButton, PrimaryButton } from '../../../../common/components/ui-brick';

interface DashboardSummaryProps {
	lowStockCount: number;
	overdueAuditCount: number;
	onDownloadExcel: () => void;
	onDownloadLogs: () => void;
}

const DashboardSummary = ({ lowStockCount, overdueAuditCount, onDownloadExcel, onDownloadLogs }: DashboardSummaryProps) => {
	return (
		<>
			<H3>📌 요약</H3>
			<Box>
				<View style={localStyles.grid}>
					<View style={[localStyles.statCard, { backgroundColor: '#fff7e6', borderColor: '#ffd591' }]}>
						<Text style={{ fontSize: 12, color: '#fa8c16' } as TextStyle}>재고 부족</Text>
						<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#d46b08' } as TextStyle}>
							{lowStockCount} <Text style={{ fontSize: 14 } as TextStyle}>건</Text>
						</Text>
					</View>
					<View style={[localStyles.statCard, { backgroundColor: '#f0f5ff', borderColor: '#adc6ff' }]}>
						<Text style={{ fontSize: 12, color: '#2f54eb' } as TextStyle}>실사 필요</Text>
						<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1d39c4' } as TextStyle}>
							{overdueAuditCount} <Text style={{ fontSize: 14 } as TextStyle}>건</Text>
						</Text>
					</View>
					<PrimaryButton onPress={onDownloadExcel} style={localStyles.gridItem}>
						📦 재고현황 받기
					</PrimaryButton>
					<SecondaryButton onPress={onDownloadLogs} style={localStyles.gridItem}>
						📋 활동로그 받기
					</SecondaryButton>
				</View>
			</Box>
		</>
	);
};

const localStyles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 15
	} as ViewStyle,
	statCard: {
		flex: 1,
		minWidth: '45%', // 2열 구성을 위해 약 50%의 너비 확보
		padding: 15,
		borderRadius: 12,
		borderWidth: 1
	} as ViewStyle,
	gridItem: {
		flex: 1,
		minWidth: '45%',
	} as ViewStyle
});
export default DashboardSummary;