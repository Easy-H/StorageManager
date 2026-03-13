import { FirebaseProductRepository as Repository } from "../api/FirebaseProductRepository";

export const useProuctData = (notice) => {

  // [3] 재고 현황 엑셀 다운로드
  const getAllProducts = () => {
    if (!products || products.length === 0)
        return notice("데이터가 없습니다.");
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
  const getAllLogs = async () => {
    
      const allLogs = await Repository.getAllLogs(currentOrg.id);
      return allLogs;
    try {
      if (allLogs.length === 0) return notice("기록된 로그가 없습니다.");

      const logExcelData = allLogs.map(d => ({
        "일시": d.timestamp ? d.timestamp.toLocaleString() : "N/A",
        "품목명": d.productName,
        "구분": mapLogType(d.type),
        "변동수량": d.changeQty || 0,
        "최종재고": d.finalStock || 0
      }));

      return logExcelData;

    } catch (e) {
      notice("로그를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return { getAllProducts, getAllLogs }

}