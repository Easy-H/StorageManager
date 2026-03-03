import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  deleteDoc, 
  collection, 
  addDoc 
} from 'firebase/firestore';

const ProductDetailModal = ({ item, orgId, onClose }) => {
  const [editMode, setEditMode] = useState(item.isNew || false);

  // 편집용 상태
  const [formName, setFormName] = useState(item.name || "");
  const [formBarcode, setFormBarcode] = useState(item.barcode || "");
  const [formSafety, setFormSafety] = useState(item.safetyStock || 2);

  // 재고 조절 상태
  const [inputQty, setInputQty] = useState(item.isNew ? 0 : 1);
  const [isDirectInput, setIsDirectInput] = useState(false);

  // 실사 날짜 실시간 반영을 위한 로컬 상태
  const [lastAuditDisplay, setLastAuditDisplay] = useState(item.lastAudit);

  // item이 변경될 때 로컬 실사 상태 동기화
  useEffect(() => {
    setLastAuditDisplay(item.lastAudit);
  }, [item.lastAudit]);

  // 증감 모드 전환 시 최소값 1 보장
  useEffect(() => {
    if (!editMode && !isDirectInput && inputQty < 1) {
      setInputQty(1);
    }
  }, [isDirectInput, editMode, inputQty]);

  const hasChanges = () => {
    return (
      formName !== (item.name || "") ||
      formBarcode !== (item.barcode || "") ||
      Number(formSafety) !== (item.safetyStock || 2)
    );
  };

  // [1] 저장 로직 (신규 등록 및 정보 수정)
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
      currentStock: item.isNew ? Number(inputQty) : item.currentStock,
      ...(item.isNew && { lastAudit: serverTimestamp() })
    };

    try {
      await setDoc(docRef, payload, { merge: true });
      
      // 신규 등록 시 로그 남기기
      if (item.isNew) {
        await addDoc(collection(db, "inventory_logs"), {
          orgId: orgId,
          productId: docId,
          productName: formName,
          type: 'CREATE',
          changeQty: Number(inputQty),
          finalStock: Number(inputQty),
          timestamp: serverTimestamp()
        });
      }
      
      onClose();
    } catch (e) { alert("저장 실패"); }
  };

  // [2] 삭제 로직
  const handleDeleteItem = async () => {
    if (!window.confirm(`[${item.name}] 품목을 삭제하시겠습니까? 기록은 남지만 품목은 사라집니다.`)) return;
    
    try {
      // 삭제 로그 먼저 기록
      await addDoc(collection(db, "inventory_logs"), {
        orgId: orgId,
        productId: item.id,
        productName: item.name,
        type: 'DELETE',
        timestamp: serverTimestamp()
      });

      await deleteDoc(doc(db, "products", item.id));
      alert("품목이 삭제되었습니다.");
      onClose();
    } catch (e) { alert("삭제 실패"); }
  };

  // [3] 재고 업데이트 로직 (로그 생성 통합)
  const handleUpdateStock = async (type) => {
    if (!isDirectInput && Number(inputQty) < 1) {
      alert("입/출고 수량은 최소 1개 이상이어야 합니다.");
      return;
    }

    const docRef = doc(db, "products", item.id);
    const prevStock = item.currentStock || 0;
    const changeAmount = Number(inputQty);
    
    let newVal = isDirectInput
      ? changeAmount
      : prevStock + (type === 'IN' ? changeAmount : -changeAmount);

    newVal = Math.max(0, newVal); // 재고는 0 미만으로 내려갈 수 없음

    try {
      // 1. 제품 재고 업데이트
      await updateDoc(docRef, {
        currentStock: newVal,
        lastUpdated: serverTimestamp(),
        lastAudit: serverTimestamp() 
      });

      // 2. 활동 로그 추가
      await addDoc(collection(db, "inventory_logs"), {
        orgId: orgId,
        productId: item.id,
        productName: item.name,
        type: isDirectInput ? 'ADJUST' : type, // ADJUST(직접수정), IN(입고), OUT(출고)
        prevStock: prevStock,
        changeQty: isDirectInput ? (newVal - prevStock) : (type === 'IN' ? changeAmount : -changeAmount),
        finalStock: newVal,
        timestamp: serverTimestamp()
      });

      alert(`${isDirectInput ? '재고 수정' : (type === 'IN' ? '입고' : '출고')} 완료`);
      onClose();
    } catch (e) { alert("업데이트 실패"); }
  };

  // [4] 단순 실사 확인
  const handleAuditItem = async () => {
    if (!window.confirm("현재 수량이 실제 재고와 일치함을 확인하셨습니까?")) return;
    const docRef = doc(db, "products", item.id);
    const now = new Date();
    try {
      await updateDoc(docRef, { lastAudit: serverTimestamp() });
      
      // 실사 로그 기록
      await addDoc(collection(db, "inventory_logs"), {
        orgId: orgId,
        productId: item.id,
        productName: item.name,
        type: 'AUDIT',
        finalStock: item.currentStock,
        timestamp: serverTimestamp()
      });

      setLastAuditDisplay({ toDate: () => now });
      alert("실사 확인이 완료되었습니다.");
    } catch (e) { alert("업데이트 실패"); }
  };

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
          <div className="form-stack">
            <h3>{item.isNew ? "신규 품목 등록" : "정보 수정"}</h3>
            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="품목 이름" className="input-basic" />
            <input value={formBarcode} onChange={e => setFormBarcode(e.target.value)} placeholder="바코드(선택)" className="input-basic" />
            <label style={{ fontSize: '12px', textAlign: 'left', marginTop: '10px' }}>안전 재고 기준 (개)</label>
            <input type="number" value={formSafety} onChange={e => setFormSafety(e.target.value)} className="input-basic" />
            
            <div className="button-row" style={{ marginTop: '10px', gap: '8px' }}>
              <button onClick={handleSaveItem} className="green-button" style={{ flex: 2 }}>저장하기</button>
              {!item.isNew && (
                <button onClick={handleDeleteItem} className="link-button" style={{ color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '8px', fontSize: '14px' }}>삭제</button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{item.name}</h3>
              <button onClick={() => setEditMode(true)} className="link-button" style={{ margin: 0, padding: 0 }}>편집</button>
            </div>

            <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>현재 실재고</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: item.currentStock <= item.safetyStock ? '#ff4d4f' : '#333' }}>
                {item.currentStock}개
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                최근 실사: {lastAuditDisplay ? lastAuditDisplay.toDate().toLocaleDateString() : '기록 없음'}
              </div>
              <button onClick={handleAuditItem} style={{ color: '#4a90e2', background: "white", border: '1px solid #ddd', borderRadius: '20px', marginTop: '10px', padding: '6px 15px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                ✅ 수량 일치 확인 (실사)
              </button>
            </div>

            <div>
              <div className="qty-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
                <button 
                  onClick={() => setInputQty(q => isDirectInput ? Math.max(0, q - 1) : Math.max(1, q - 1))} 
                  className="circle-qty-btn">-</button>
                <input
                  type="number"
                  value={inputQty}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setInputQty(isDirectInput ? Math.max(0, val) : Math.max(1, val));
                  }}
                  className="qty-display-input"
                  style={{ textAlign: 'center', width: '70px', fontSize: '24px', border: 'none', borderBottom: '2px solid #ddd', background: 'transparent' }}
                />
                <button onClick={() => setInputQty(q => q + 1)} className="circle-qty-btn">+</button>
              </div>

              <div className="button-row">
                {isDirectInput ? (
                  <button onClick={() => handleUpdateStock()} className="primary-button" style={{ flex: 1 }}>이 수량으로 확정 (실사 포함)</button>
                ) : (
                  <>
                    <button onClick={() => handleUpdateStock('IN')} className="green-button">입고(+)</button>
                    <button onClick={() => handleUpdateStock('OUT')} className="blue-button">출고(-)</button>
                  </>
                )}
              </div>

              <div className="qty-row" style={{ marginTop: '15px' }}>
                <button onClick={() => { setIsDirectInput(!isDirectInput); setInputQty(isDirectInput ? 1 : item.currentStock); }} className="link-button" style={{ fontSize: '12px', color: '#888' }}>
                  {isDirectInput ? "◀ 증감 모드로 전환" : "실재고 숫자를 직접 수정"}
                </button>
              </div>
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