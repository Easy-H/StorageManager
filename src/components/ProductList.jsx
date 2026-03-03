import React from 'react';

const ProductList = ({ products, searchTerm, onSelectProduct }) => {
  // 검색어 정규화 (대소문자 구분 없이 검색하기 위해)
  const s = searchTerm.toLowerCase();

  const filtered = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(s);
    // 바코드가 없을 경우를 대비해 기본값 "" 설정 후 검색
    const barcodeMatch = (p.barcode || "").toLowerCase().includes(s);
    
    return nameMatch || barcodeMatch; // 이름 혹은 바코드가 일치하면 true
  });

  return (
    <div className="product-list">
      {filtered.length > 0 ? (
        filtered.map(p => (
          <div key={p.id} onClick={() => onSelectProduct(p)} className="product-item">
            <div>
              <b>{p.name}</b>
              <div style={{ fontSize: '10px', color: '#999' }}>{p.barcode || "바코드 없음"}</div>
            </div>
            <div className={p.currentStock <= (p.safetyStock || 0) ? 'low-stock' : ''}>
              <b>{p.currentStock}</b> 개
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ProductList;