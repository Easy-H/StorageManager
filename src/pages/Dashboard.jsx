import React from 'react';
import Header from '../components/Header';
import * as XLSX from 'xlsx';

const Dashboard = ({ products, currentOrg, onBackToOrgSelector }) => {
  // 1. 통계 데이터 계산
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.currentStock <= (p.safetyStock || 0)).length;
  const overdueAuditItems = products.filter(p => {
    if (!p.lastAudit) return true;
    const diffDays = Math.ceil(Math.abs(new Date() - p.lastAudit.toDate()) / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  }).length;


  // 엑셀 다운로드
  const handleDownloadExcel = () => {
    if (!products || products.length === 0) return alert("데이터가 없습니다.");
    const excelData = products.map(p => ({
      "품목명": p.name,
      "바코드": p.barcode || "N/A",
      "현재재고": p.currentStock,
      "안전재고": p.safetyStock || 0,
      "최근실사일": p.lastAudit ? p.lastAudit.toDate().toLocaleString() : "기록없음"
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "재고현황");
    XLSX.writeFile(workbook, `${currentOrg.name}_재고현황.xlsx`);
  };

  return (
    <>
      <Header currentOrg={currentOrg} onBackToOrgSelector={onBackToOrgSelector} />
      <div className="app-wrapper" style={{ padding: '20px' }}>

        {/* 주요 지표 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          <div className="stat-card" style={{ background: '#fff7e6', padding: '15px', borderRadius: '12px', border: '1px solid #ffd591' }}>
            <div style={{ fontSize: '12px', color: '#fa8c16' }}>재고 부족</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d46b08' }}>{lowStockItems} <span style={{ fontSize: '14px' }}>건</span></div>
          </div>
          <div className="stat-card" style={{ background: '#f0f5ff', padding: '15px', borderRadius: '12px', border: '1px solid #adc6ff' }}>
            <div style={{ fontSize: '12px', color: '#2f54eb' }}>실사 필요</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d39c4' }}>{overdueAuditItems} <span style={{ fontSize: '14px' }}>건</span></div>
          </div>
        </div>

        {/* 분석 섹션 */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>🚀 빠른 조치 필요</h3>
          {lowStockItems > 0 ? (
            <p style={{ fontSize: '14px', color: '#666' }}>
              현재 <strong>{lowStockItems}개</strong>의 품목이 안전 재고 밑으로 떨어졌습니다. 발주를 검토하세요.
            </p>
          ) : (
            <p style={{ fontSize: '14px', color: '#52c41a' }}>✅ 모든 품목의 재고가 충분합니다.</p>
          )}
        </div>

        {/* (추가 가능) 간단한 막대 그래프 형태의 재고 현황 
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '16px' }}>📦 품목별 재고 비중</h3>
          <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
            (여기에 Recharts 등을 활용한 차트를 넣을 수 있습니다)
          </div>
        </div>*/}
          <button onClick={handleDownloadExcel} className="excel-btn">📊 엑셀 저장</button>
      </div>
    </>
  );
};

export default Dashboard;