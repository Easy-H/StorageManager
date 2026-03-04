import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import * as XLSX from 'xlsx';
// Firebase 관련 import가 사라지고 Repository만 남습니다.
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';

const DashboardPage = ({ products, currentOrg, onBack, notice }) => {
  const [logs, setLogs] = useState([]);

  // [1] 최근 활동 로그 구독 (추상화된 API 사용)
  useEffect(() => {
    if (!currentOrg?.id) return;
    const unsubscribe = Repository.subscribeRecentLogs(currentOrg.id, (data) => {
      setLogs(data);
    });
    return () => unsubscribe();
  }, [currentOrg.id]);

  // [2] 데이터 계산 (p.lastAudit은 이제 Date 객체임)
  const lowStockList = products.filter(p => p.currentStock <= (p.safetyStock || 0));
  const lowStockItems = lowStockList.length;

  const overdueAuditItems = products.filter(p => {
    if (!p.lastAudit) return true;
    const diffDays = Math.ceil(Math.abs(new Date() - p.lastAudit) / (1000 * 60 * 60 * 24));
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
      const allLogs = await Repository.getAllLogs(currentOrg.id);
      if (allLogs.length === 0) return notice("기록된 로그가 없습니다.");

      const logExcelData = allLogs.map(d => ({
        "일시": d.timestamp ? d.timestamp.toLocaleString() : "N/A",
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
  const downloadFile = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // 헬퍼 함수: 로그 타입 한글 변환
  const mapLogType = (type) => {
    const types = { IN: '입고', OUT: '출고', ADJUST: '수정', CREATE: '신규등록', DELETE: '삭제', AUDIT: '실사' };
    return types[type] || '기타';
  };

  return (
    <>
      <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
      <div className="app-wrapper" style={{ padding: '20px', paddingBottom: '80px' }}>

        {/* 주요 지표 카드 */}

        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🚨 요약</h3>
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

        {/* 🚀 발주 필요 리스트 섹션 (수정된 부분) */}

        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🚨 발주 필요 품목</h3>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
          {lowStockItems > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStockList.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fff1f0', borderRadius: '8px', border: '1px solid #ffa39e' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#cf1322' }}>
                    현재: <strong>{item.currentStock}</strong> / 기준: {item.safetyStock}
                  </div>
                </div>
              ))}
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>* 안전 재고 기준보다 낮거나 같은 품목입니다.</p>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#52c41a', margin: 0 }}>✅ 모든 품목의 재고가 충분합니다.</p>
          )}
        </div>

        {/* 최근 활동 로그 */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🕒 최근 활동</h3>
          <div style={{ background: '#fff', borderRadius: '15px', border: '1px solid #eee', overflow: 'hidden' }}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={log.id} style={{
                  padding: '12px 15px',
                  borderBottom: index !== logs.length - 1 ? '1px solid #f5f5f5' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ fontWeight: '500' }}>{log.productName}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{log.timestamp?.toLocaleString('ko-KR', { hour12: false })}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: log.type === 'IN' ? '#52c41a' : log.type === 'OUT' ? '#ff4d4f' : '#1890ff' }}>
                    {log.type === 'IN' ? `+${log.changeQty}` : log.type === 'OUT' ? `-${log.changeQty}` : '기록'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#999', fontSize: '13px' }}>기록이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 다운로드 버튼 2개 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button onClick={handleDownloadExcel} className="excel-btn" style={{ width: '100%', margin: 0 }}>
            📦 재고현황 받기
          </button>
          <button onClick={handleDownloadLogs} className="excel-btn" style={{ width: '100%', margin: 0, backgroundColor: '#52c41a' }}>
            📋 활동로그 받기
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;