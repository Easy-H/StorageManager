import React from 'react';

const ProductList = ({ products, searchTerm, onSelectProduct, sortBy }) => {
  const s = searchTerm.toLowerCase();

  // 1. 검색 필터링
  let displayList = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(s);
    const barcodeMatch = (p.barcode || "").toLowerCase().includes(s);
    return nameMatch || barcodeMatch;
  });

  // 2. 정렬 로직
  displayList.sort((a, b) => {
    if (sortBy === "lowStock") {
      // 재고 부족 정도 계산 (현재재고 - 안전재고)
      const aGap = a.currentStock - (a.safetyStock || 0);
      const bGap = b.currentStock - (b.safetyStock || 0);
      return aGap - bGap; // 부족한 게 위로
    }
    if (sortBy === "oldAudit") {
      // 실사 날짜 비교 (기록 없으면 가장 과거로 처리)
      const aTime = a.lastAudit ? a.lastAudit.toDate().getTime() : 0;
      const bTime = b.lastAudit ? b.lastAudit.toDate().getTime() : 0;
      return aTime - bTime; // 오래된 게 위로
    }
    // 기본: 이름순
    return a.name.localeCompare(b.name);
  });

  // 실사 상태 배지 로직 (이전과 동일)
  const getAuditStatus = (lastAudit) => {
    if (!lastAudit) return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6" };
    const diffDays = Math.ceil(Math.abs(new Date() - lastAudit.toDate()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return { text: "실사완료", color: "#52c41a", bg: "#f6ffed" };
    if (diffDays <= 30) return { text: "점검예정", color: "#1890ff", bg: "#e6f7ff" };
    return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6" };
  };

  return (
    <div className="product-list">
      {displayList.map(p => {
        const isLow = p.currentStock <= (p.safetyStock || 0);
        const audit = getAuditStatus(p.lastAudit);

        return (
          <div key={p.id} onClick={() => onSelectProduct(p)} className="product-item" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 15px', borderBottom: '1px solid #eee', cursor: 'pointer'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <b style={{ fontSize: '16px' }}>{p.name}</b>
                <span style={{ fontSize: '10px', color: audit.color, backgroundColor: audit.bg, padding: '2px 5px', borderRadius: '4px' }}>
                  {audit.text}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>{p.barcode || "N/A"}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: isLow ? '#ff4d4f' : '#333' }}>
                {p.currentStock}개
              </div>
              {isLow && <div style={{ fontSize: '9px', color: '#ff4d4f', fontWeight: 'bold' }}>재고부족</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;