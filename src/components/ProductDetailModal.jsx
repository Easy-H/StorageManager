import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const ProductDetailModal = ({ item, orgId, onClose }) => {
  const [editMode, setEditMode] = useState(item.isNew || false);
  
  // 편집용 상태
  const [formName, setFormName] = useState(item.name || "");
  const [formBarcode, setFormBarcode] = useState(item.barcode || "");
  const [formSafety, setFormSafety] = useState(item.safetyStock || 2);
  
  // 재고 조절 상태
  const [inputQty, setInputQty] = useState(item.isNew ? 0 : 1);
  const [isDirectInput, setIsDirectInput] = useState(false);

  // 변경 사항 체크 함수
  const hasChanges = () => {
    return (
      formName !== (item.name || "") ||
      formBarcode !== (item.barcode || "") ||
      Number(formSafety) !== (item.safetyStock || 2)
    );
  };

  // 저장 로직
  const handleSaveItem = async () => {
    if (!formName) return alert("품목 이름을 입력하세요.");
    const docId = item.id || formBarcode || `M-${Date.now()}`;
    const docRef = doc(db, "products", docId);
    
    const payload = {
      name: formName,
      barcode: formBarcode,
      safetyStock: Number(formSafety),
      orgId: orgId,
      lastUpdated: serverTimestamp(),
      currentStock: item.isNew ? Number(inputQty) : item.currentStock
    };

    try {
      await setDoc(docRef, payload, { merge: true });
      onClose();
    } catch (e) { alert("저장 실패"); }
  };

  // 재고 업데이트 로직
  const handleUpdateStock = async (type) => {
    const docRef = doc(db, "products", item.id);
    let newVal = isDirectInput 
      ? Number(inputQty) 
      : item.currentStock + (type === 'IN' ? Number(inputQty) : -Number(inputQty));

    try {
      await updateDoc(docRef, { 
        currentStock: Math.max(0, newVal),
        lastUpdated: serverTimestamp()
      });
      onClose();
    } catch (e) { alert("업데이트 실패"); }
  };

  // 닫기/이전 핸들러 (변경 사항 있을 때만 confirm)
  const handleCancel = () => {
    if (editMode && !item.isNew) {
      if (hasChanges()) {
        if (window.confirm("수정된 내용이 있습니다. 저장하지 않고 나갈까요?")) {
          setEditMode(false);
        }
      } else {
        setEditMode(false);
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content editor-container">
        {editMode ? (
          /* --- [1] 정보 편집 모드 --- */
          <div className="form-stack">
            <h3>{item.isNew ? "신규 품목 등록" : "정보 수정"}</h3>
            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="품목 이름" className="input-basic" />
            <input value={formBarcode} onChange={e => setFormBarcode(e.target.value)} placeholder="바코드(선택)" className="input-basic" />
            <label style={{fontSize:'12px', textAlign:'left', marginTop:'10px'}}>안전 재고 기준 (개)</label>
            <input type="number" value={formSafety} onChange={e => setFormSafety(e.target.value)} className="input-basic" />
            <button onClick={handleSaveItem} className="green-button">저장하기</button>
          </div>
        ) : (
          /* --- [2] 재고 관리 모드 --- */
          <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{margin:0}}>{item.name}</h3>
              <button onClick={() => setEditMode(true)} className="link-button" style={{margin:0}}>편집</button>
            </div>
            
            <div style={{background:'#f5f5f5', padding:'15px', borderRadius:'10px', margin:'10px 0'}}>
              <div style={{fontSize:'12px', color:'#666'}}>현재 실재고</div>
              <div style={{fontSize:'28px', fontWeight:'bold', color: item.currentStock <= item.safetyStock ? '#ff4d4f' : '#333'}}>
                {item.currentStock}개
              </div>
            </div>

            {/* 수량 조절부 (입력 모드 상관없이 증감 버튼 노출) */}
            <div className="qty-row" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'15px', margin:'20px 0'}}>
              <button onClick={() => setInputQty(q => Math.max(0, q - 1))} className="circle-qty-btn">-</button>
              <input 
                type="number" 
                value={inputQty} 
                onChange={e => setInputQty(Number(e.target.value))} 
                className="qty-display-input"
                style={{textAlign:'center', width:'60px', fontSize:'20px', border:'none', borderBottom:'2px solid #ddd'}}
              />
              <button onClick={() => setInputQty(q => q + 1)} className="circle-qty-btn">+</button>
            </div>

            {/* 하단 버튼부 */}
            <div className="button-row">
              {isDirectInput ? (
                <button onClick={() => handleUpdateStock()} className="primary-button" style={{flex:1}}>이 수량으로 확정</button>
              ) : (
                <>
                  <button onClick={() => handleUpdateStock('IN')} className="green-button">입고(+)</button>
                  <button onClick={() => handleUpdateStock('OUT')} className="blue-button">출고(-)</button>
                </>
              )}
            </div>

            <div className="qty-row" style={{marginTop:'10px'}}>
              <button onClick={() => { setIsDirectInput(!isDirectInput); setInputQty(isDirectInput ? 1 : item.currentStock); }} className="link-button" style={{fontSize:'12px'}}>
                {isDirectInput ? "◀ 증감 모드로 전환" : "실재고 숫자를 직접 수정"}
              </button>
            </div>
          </>
        )}

        <button onClick={handleCancel} className="close-modal-btn">
          {editMode && !item.isNew ? "이전으로" : "닫기"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailModal;