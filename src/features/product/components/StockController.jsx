import React, { useState } from 'react';

const StockController = ({ inputQty, setInputQty, currentStock, updateStock, item }) => {
  const [isDirectInput, setIsDirectInput] = useState(false);

  const handleDecrease = () => setInputQty(q => isDirectInput ? Math.max(0, q - 1) : Math.max(1, q - 1));
  const handleIncrease = () => setInputQty(q => q + 1);

  // ✨ 출고 전 검증 로직
  const handleOutStock = () => {
    if (inputQty > currentStock) {
      alert(`재고가 부족합니다! (현재: ${currentStock}개 / 요청: ${inputQty}개)`);
      return;
    }
    updateStock(item, inputQty, false, 'OUT');
  };

  return (
    <>
      <div className="qty-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
        <button onClick={handleDecrease} className="circle-qty-btn">-</button>
        <input
          type="number"
          value={inputQty}
          onChange={e => {
            const val = Number(e.target.value);
            // 직접 입력 모드에서도 0 미만은 입력 불가하도록 방어
            setInputQty(isDirectInput ? Math.max(0, val) : Math.max(1, val));
          }}
          className="qty-display-input"
          style={{ textAlign: 'center', width: '70px', fontSize: '24px', border: 'none', borderBottom: '2px solid #ddd', background: 'transparent' }}
        />
        <button onClick={handleIncrease} className="circle-qty-btn">+</button>
      </div>

      <div className="button-row" style={{ display: 'flex', gap: '10px' }}>
        {isDirectInput ? (
          <button 
            onClick={() => updateStock(item, inputQty, true, 'ADJUST')} 
            className="primary-button" 
            style={{ flex: 1 }}
          >
            이 수량으로 확정 (실사 포함)
          </button>
        ) : (
          <>
            <button 
              onClick={() => updateStock(item, inputQty, false, 'IN')} 
              className="green-button" 
              style={{ flex: 1 }}
            >
              입고(+)
            </button>
            <button 
              onClick={handleOutStock} // ✨ 검증 함수로 교체
              className="blue-button" 
              style={{ flex: 1, backgroundColor: inputQty > currentStock ? '#ccc' : '' }} // 재고 부족 시 색상 변경(선택)
            >
              출고(-)
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => { 
          setIsDirectInput(!isDirectInput); 
          setInputQty(isDirectInput ? 1 : currentStock); 
        }}
        className="link-button"
        style={{ fontSize: '12px', color: '#888', marginTop: '15px' }}
      >
        {isDirectInput ? "◀ 증감 모드로 전환" : "실재고 숫자를 직접 수정"}
      </button>
    </>
  );
};

export default StockController;