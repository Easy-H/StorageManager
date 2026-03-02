import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { 
  collection, onSnapshot, doc, updateDoc, increment, 
  addDoc, setDoc, serverTimestamp 
} from 'firebase/firestore';
import { Html5QrcodeScanner } from 'html5-qrcode';

function App() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'IN', 'OUT', 'SEARCH'
  const [statusMsg, setStatusMsg] = useState('시스템 준비 완료');
  const [mainSearchTerm, setMainSearchTerm] = useState(""); // 메인 화면 검색어

  // 1. 실시간 데이터 불러오기
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. 스캐너 로직 (입고/출고/조회 공용)
  useEffect(() => {
    if (!isScannerOpen) return;

    const scanner = new Html5QrcodeScanner("reader", { 
      fps: 20, 
      qrbox: { width: 300, height: 150 },
      showTorchButtonIfSupported: true 
    });

    scanner.render(async (decodedText) => {
      if (mode === 'SEARCH') {
        setMainSearchTerm(decodedText); // 조회 모드일 땐 검색어에 입력
        setIsScannerOpen(false);
      } else {
        await handleInventoryUpdate(decodedText);
        setIsScannerOpen(false);
      }
    }, () => {});

    return () => { scanner.clear().catch(() => {}); };
  }, [isScannerOpen, mode]);

  // 3. 재고 업데이트 (입/출고 전용)
  const handleInventoryUpdate = async (barcode) => {
    const product = products.find(p => p.barcode === barcode || p.id === barcode);
    const changeQty = mode === 'IN' ? 1 : -1;

    try {
      if (!product) {
        await setDoc(doc(db, "products", barcode), {
          name: `🆕 미등록 (${barcode})`,
          barcode: barcode,
          currentStock: changeQty > 0 ? changeQty : 0,
          safetyStock: 5,
          lastEventAt: serverTimestamp(),
          lastCheckedAt: serverTimestamp(),
          isTemporary: true
        });
      } else {
        await updateDoc(doc(db, "products", product.id), {
          currentStock: increment(changeQty),
          lastEventAt: serverTimestamp()
        });
      }
      await addDoc(collection(db, "events"), { productId: barcode, type: mode, quantity: 1, timestamp: serverTimestamp() });
      new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3').play();
    } catch (err) { console.error(err); }
  };

  // 4. 관리자 전용: 실사 확인 업데이트
  const handleCheckUpdate = async (id) => {
    await updateDoc(doc(db, "products", id), {
      lastCheckedAt: serverTimestamp()
    });
    setStatusMsg("✅ 실사 확인 기록 완료");
  };

  // 5. 검색 필터링 로직
  const displayProducts = products.filter(p => 
    p.name.toLowerCase().includes(mainSearchTerm.toLowerCase()) || 
    p.barcode.includes(mainSearchTerm)
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏢 재고 마스터</h2>
        <button onClick={() => setIsAdmin(!isAdmin)} style={styles.adminBtn}>
          {isAdmin ? "🔓 관리자" : "🔒 일반"}
        </button>
      </header>

      {/* 상단 통합 검색바 */}
      <div style={styles.searchBox}>
        <input 
          type="text" 
          placeholder="상품명 또는 바코드 검색..." 
          value={mainSearchTerm}
          onChange={(e) => setMainSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button 
          onClick={() => { setMode('SEARCH'); setIsScannerOpen(true); }}
          style={styles.searchScanBtn}
        >📷</button>
      </div>

      {/* 재고 리스트 */}
      <section style={styles.listSection}>
        {displayProducts.length === 0 ? (
          <p style={{textAlign:'center', color:'#999'}}>검색 결과가 없습니다.</p>
        ) : (
          displayProducts.map(p => (
            <div key={p.id} style={{...styles.card, borderLeft: p.isTemporary ? '5px solid #ffc107' : '5px solid #007bff'}}>
              <div style={{flex: 1}}>
                <div style={styles.pName}>{p.name}</div>
                <div style={styles.pBarcode}>{p.barcode}</div>
                <div style={styles.pDate}>마지막 실사: {p.lastCheckedAt?.toDate().toLocaleDateString() || '-'}</div>
              </div>
              <div style={styles.stockArea}>
                <div style={{fontSize:'1.5rem', fontWeight:'bold', color: p.currentStock <= p.safetyStock ? 'red' : '#333'}}>
                  {p.currentStock}
                </div>
                {isAdmin && (
                  <button onClick={() => handleCheckUpdate(p.id)} style={styles.checkBtn}>실사완료</button>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* 하단 입출고 버튼 */}
      <div style={styles.footer}>
        <button onClick={() => { setMode('IN'); setIsScannerOpen(true); }} style={styles.inBtn}>입고(+)</button>
        <button onClick={() => { setMode('OUT'); setIsScannerOpen(true); }} style={styles.outBtn}>출고(-)</button>
      </div>

      {/* 스캐너 모달 */}
      {isScannerOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>[{mode === 'SEARCH' ? '조회 스캔' : mode === 'IN' ? '입고' : '출고'}]</h3>
            <div id="reader"></div>
            <button onClick={() => setIsScannerOpen(false)} style={styles.closeBtn}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', padding: '15px', paddingBottom: '100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  adminBtn: { padding: '5px 10px', borderRadius: '15px', border: '1px solid #ccc', fontSize: '12px' },
  searchBox: { display: 'flex', gap: '5px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
  searchScanBtn: { padding: '0 15px', backgroundColor: '#333', color: '#fff', borderRadius: '8px', border: 'none' },
  listSection: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { display: 'flex', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', alignItems: 'center' },
  pName: { fontWeight: 'bold', fontSize: '1.1rem' },
  pBarcode: { fontSize: '12px', color: '#666' },
  pDate: { fontSize: '11px', color: '#999', marginTop: '4px' },
  stockArea: { textAlign: 'right', minWidth: '80px' },
  checkBtn: { marginTop: '5px', fontSize: '11px', padding: '4px 8px', backgroundColor: '#e7f3ff', color: '#007bff', border: 'none', borderRadius: '4px' },
  footer: { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', padding: '15px', gap: '10px', backgroundColor: '#333', borderTop: '1px solid #eee' },
  inBtn: { flex: 1, padding: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  outBtn: { flex: 1, padding: '15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', width: '90%', maxWidth: '400px' },
  closeBtn: { width: '100%', marginTop: '15px', padding: '10px', border: 'none', borderRadius: '8px', backgroundColor: '#eee', color: 'black' }
};

export default App;