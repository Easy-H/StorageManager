import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import * as XLSX from 'xlsx';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

const Dashboard = ({ products, currentOrg, onBackToOrgSelector }) => {
  const [logs, setLogs] = useState([]);

  // [1] 최근 활동 로그 5개 실시간 리스너
  useEffect(() => {
    if (!currentOrg?.id) return;

    const q = query(
      collection(db, "inventory_logs"),
      where("orgId", "==", currentOrg.id),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logData);
    });

    return () => unsubscribe();
  }, [currentOrg.id]);

  // [2] 통계 데이터 계산
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.currentStock <= (p.safetyStock || 0)).length;
  const overdueAuditItems = products.filter(p => {
    if (!p.lastAudit) return true;
    const diffDays = Math.ceil(Math.abs(new Date() - p.lastAudit.toDate()) / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  }).length;

  // [3] 재고 현황 엑셀 다운로드
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

  // [4] 전체 로그 엑셀 다운로드
  const handleDownloadLogs = async () => {
    try {
      // 전체 로그를 가져오기 위해 다시 쿼리 (제한 없음)
      const q = query(
        collection(db, "inventory_logs"),
        where("orgId", "==", currentOrg.id),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return alert("기록된 로그가 없습니다.");

      const logExcelData = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          "일시": d.timestamp?.toDate().toLocaleString() || "N/A",
          "품목명": d.productName,
          "구분": d.type === 'IN' ? '입고' : d.type === 'OUT' ? '출고' : d.type === 'ADJUST' ? '수정' : d.type === 'CREATE' ? '신규등록' : d.type === 'DELETE' ? '삭제' : '실사',
          "변동수량": d.changeQty || 0,
          "최종재고": d.finalStock || 0
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(logExcelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "활동기록");
      XLSX.writeFile(workbook, `${currentOrg.name}_활동로그.xlsx`);
    } catch (e) {
      alert("로그를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header currentOrg={currentOrg} onBackToOrgSelector={onBackToOrgSelector} />
      <div className="app-wrapper" style={{ padding: '20px', paddingBottom: '80px' }}>

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

        {/* 빠른 조치 섹션 */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', marginTop: 0 }}>🚀 조치 알림</h3>
          {lowStockItems > 0 ? (
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              현재 <strong>{lowStockItems}개</strong> 품목이 발주가 필요합니다.
            </p>
          ) : (
            <p style={{ fontSize: '14px', color: '#52c41a', margin: 0 }}>✅ 재고 상태가 양호합니다.</p>
          )}
        </div>

        {/* 최근 활동 로그 (최근 5개 미리보기) */}
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
                    <div style={{ fontSize: '11px', color: '#999' }}>{log.timestamp?.toDate().toLocaleString('ko-KR', { hour12: false })}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: log.type === 'IN' ? '#52c41a' : log.type === 'OUT' ? '#ff4d4f' : '#1890ff' }}>
                    {log.type === 'IN' ? `+${log.changeQty}` : log.type === 'OUT' ? `${log.changeQty}` : '기록'}
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

export default Dashboard;