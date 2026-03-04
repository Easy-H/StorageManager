import React from 'react';

const ProductEditor = ({ item, form, setForm, onSave, onDelete, inputQty }) => (
  <div className="form-stack">
    <h3>{item.isNew ? "신규 품목 등록" : "정보 수정"}</h3>
    <input 
      value={form.name} 
      onChange={e => setForm({...form, name: e.target.value})} 
      placeholder="품목 이름" 
      className="input-basic" 
    />
    <input 
      value={form.barcode} 
      onChange={e => setForm({...form, barcode: e.target.value})} 
      placeholder="바코드(선택)" 
      className="input-basic" 
    />
    <label style={{ fontSize: '12px', textAlign: 'left', marginTop: '10px' }}>안전 재고 기준 (개)</label>
    <input 
      type="number" 
      value={form.safetyStock} 
      onChange={e => setForm({...form, safetyStock: Number(e.target.value)})} 
      className="input-basic" 
    />
    
    <div className="button-row" style={{ marginTop: '10px', gap: '8px' }}>
      <button onClick={() => onSave(item, form, inputQty)} className="green-button" style={{ flex: 2 }}>저장하기</button>
      {!item.isNew && (
        <button onClick={() => onDelete(item)} className="link-button" style={{ color: '#ff4d4f' }}>삭제</button>
      )}
    </div>
  </div>
);

export default ProductEditor;