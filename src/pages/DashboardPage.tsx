import React from 'react';
import Header from '../common/components/Header';
import * as XLSX from 'xlsx';
import { ScrollView } from 'react-native';
import { styles } from '../styles';
import { useLog } from '../features/product/hooks/useLog';
import DashboardSummary from '../features/product/components/dashboard/DashboardSummary';
import LowStockList from '../features/product/components/dashboard/LowStockList';
import RecentActivityLog from '../features/product/components/dashboard/RecentActivityLog';
import { Product } from '../features/product/types';
import { OrgMembership } from '../features/org/types';

interface DashboardPageProps {
	products: Product[];
	currentOrg: OrgMembership;
	onBack: () => void;
	notice: (msg: string) => void;
}

const DashboardPage = ({ products, currentOrg, onBack, notice }: DashboardPageProps) => {
	const { recentLogs, getAllLogs } = useLog(currentOrg);

	// [2] 데이터 계산 (p.lastAudit은 이제 Date 객체임)
	const lowStockList = products.filter(p => p.currentStock <= (p.safetyStock || 0)) as any;
	const lowStockItems = lowStockList.length;

	const overdueAuditItems = products.filter(p => {
		if (!p.lastAudit) return true;
		const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(p.lastAudit).getTime()) / (1000 * 60 * 60 * 24));
		return diffDays > 30;
	}).length;

	// [3] 재고 현황 엑셀 다운로드
	const handleDownloadExcel = () => {
		if (!products || products.length === 0) return notice("데이터가 없습니다.");
		const excelData = products.map(p => ({
			"품목명": p.name,
			"바코드": p.barcode || "N/A",
			"현재재고": p.currentStock,
			"안전재고": p.safetyStock || 0,
			"최근실사일": p.lastAudit ? p.lastAudit.toLocaleDateString() : "기록없음"
		}));
		downloadFile(excelData, `${currentOrg.name}_재고현황`);
	};

	// [4] 전체 로그 엑셀 다운로드
	const handleDownloadLogs = async () => {
		try {
			const allLogs: any[] = await getAllLogs();
			if (allLogs.length === 0) return notice("기록된 로그가 없습니다.");

			const logExcelData = allLogs.map(d => ({
				"일시": d.timestamp ? (d.timestamp.toLocaleString ? d.timestamp.toLocaleString() : new Date(d.timestamp).toLocaleString()) : "N/A",
				"품목명": d.productName,
				"구분": mapLogType(d.type),
				"변동수량": d.changeQty || 0,
				"최종재고": d.finalStock || 0
			}));
			downloadFile(logExcelData, `${currentOrg.name}_활동로그`);
		} catch (e) {
			notice("로그를 불러오는 중 오류가 발생했습니다.");
		}
	};

	// 헬퍼 함수: 엑셀 파일 생성 및 다운로드
	const downloadFile = (data: any[], fileName: string) => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, `${fileName}.xlsx`);
	};

	// 헬퍼 함수: 로그 타입 한글 변환
	const mapLogType = (type: string) => {
		const types: Record<string, string> = { IN: '입고', OUT: '출고', ADJUST: '수정', CREATE: '신규등록', DELETE: '삭제', AUDIT: '실사' };
		return types[type] || '기타';
	};

	return (
		<>
			<Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
			<ScrollView showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.appContent}>
				<DashboardSummary
					lowStockCount={lowStockItems}
					overdueAuditCount={overdueAuditItems}
					onDownloadExcel={handleDownloadExcel}
					onDownloadLogs={handleDownloadLogs}
				/>

				<LowStockList items={lowStockList} />

				<RecentActivityLog logs={recentLogs} />
			</ScrollView>
		</>
	);
};

export default DashboardPage;