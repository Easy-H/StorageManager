import React from 'react';
import StockController from './StockController';

const StockManager = ({ item, lastAuditDisplay, onAudit, onEditMode, inputQty, setInputQty, updateStock }) => {

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <button onClick={onEditMode} className="link-button">편집</button>
            </div>

            <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '15px', textAlign: 'center', margin: '15px 0' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>현재 실재고</div>
                <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: item.currentStock <= item.safetyStock ? '#ff4d4f' : '#333'
                }}>
                    {item.currentStock}개
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                    최근 실사: {lastAuditDisplay ? lastAuditDisplay.toLocaleDateString() : '기록 없음'}
                </div>
                <button onClick={onAudit} style={auditBtnStyle}>
                    ✅ 수량 일치 확인 (실사)
                </button>
            </div>

            <StockController inputQty={inputQty} setInputQty={setInputQty} currentStock={item.currentStock} item={item} updateStock={updateStock} />
        </>
    );
};

const auditBtnStyle = {
    color: '#4a90e2',
    background: "white",
    border: '1px solid #ddd',
    borderRadius: '20px',
    marginTop: '10px',
    padding: '6px 15px',
    cursor: 'pointer',
    fontSize: '12px'
};

export default StockManager;