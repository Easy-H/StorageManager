import React, { useState, useEffect } from 'react';
import './App.css'; // 추출한 CSS 임포트
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp, 
  collection, query, where, onSnapshot, increment 
} from 'firebase/firestore';
import { Html5QrcodeScanner } from 'html5-qrcode';

// --- [컴포넌트 1] 인증 페이지 ---
const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !agreed) return alert("약관에 동의해주세요.");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("가입되었습니다! 조직을 생성하거나 참여하세요.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { alert("오류: " + err.message); }
  };

  return (
    <div className="auth-box">
      <h2>🛒 Shop-Link Stock</h2>
      <p className="sub-title">{isSignUp ? "회원가입" : "로그인"}</p>
      <form onSubmit={handleSubmit} className="form-stack">
        <input type="email" placeholder="이메일" required onChange={e => setEmail(e.target.value)} className="input-basic" />
        <input type="password" placeholder="비밀번호" required onChange={e => setPassword(e.target.value)} className="input-basic" />
        {isSignUp && (
          <div className="checkbox-row">
            <input type="checkbox" id="ag" onChange={e => setAgreed(e.target.checked)} />
            <label htmlFor="ag" style={{fontSize: '12px', marginLeft: '5px'}}>구매내역 연동 및 개인정보 활용 동의</label>
          </div>
        )}
        <button type="submit" className="primary-button">{isSignUp ? "가입하기" : "로그인"}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="link-button">
        {isSignUp ? "이미 계정이 있나요? 로그인" : "처음이신가요? 회원가입"}
      </button>
    </div>
  );
};

// --- [컴포넌트 2] 메인 애플리케이션 ---
function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputQty, setInputQty] = useState(1);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          const init = { email: currentUser.email, orgs: [], orgIds: [] };
          await setDoc(userRef, init);
          setUserProfile(init);
        } else { setUserProfile(userDoc.data()); }
        setUser(currentUser);
      } else {
        setUser(null);
        setCurrentOrg(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentOrg) return;
    const q = query(collection(db, "products"), where("orgId", "==", currentOrg.id));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentOrg]);

  useEffect(() => {
    if (!isScannerOpen || selectedItem) return;
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 150 } });
    scanner.render((decodedText) => {
      const found = products.find(p => p.barcode === decodedText);
      setSelectedItem(found || { barcode: decodedText, name: `새 품목(${decodedText})`, isNew: true, currentStock: 0 });
      setIsScannerOpen(false);
      scanner.clear();
    }, () => {});
    return () => scanner.clear().catch(() => {});
  }, [isScannerOpen, selectedItem, products]);

  const handleCreateOrg = async () => {
    const name = prompt("새 조직 이름을 입력하세요.");
    if (!name) return;
    const newId = `ORG_${Math.random().toString(36).substr(2, 9)}`;
    await setDoc(doc(db, "organizations", newId), { name, adminUid: user.uid, members: [user.uid] });
    await updateDoc(doc(db, "users", user.uid), {
      orgs: arrayUnion({ id: newId, name, role: 'admin' }),
      orgIds: arrayUnion(newId)
    });
    window.location.reload();
  };

  const handleJoinOrg = async () => {
    const code = prompt("조직 코드를 입력하세요.");
    if (!code) return;
    const orgSnap = await getDoc(doc(db, "organizations", code));
    if (!orgSnap.exists()) return alert("유효하지 않은 코드입니다.");
    await updateDoc(doc(db, "organizations", code), { members: arrayUnion(user.uid) });
    await updateDoc(doc(db, "users", user.uid), {
      orgs: arrayUnion({ id: code, name: orgSnap.data().name, role: 'member' }),
      orgIds: arrayUnion(code)
    });
    window.location.reload();
  };

  const processStock = async (type) => {
    const changeQty = type === 'IN' ? Number(inputQty) : -Number(inputQty);
    const docRef = doc(db, "products", selectedItem.barcode);
    try {
      if (selectedItem.isNew) {
        await setDoc(docRef, {
          name: selectedItem.name, barcode: selectedItem.barcode,
          currentStock: Math.max(0, changeQty), orgId: currentOrg.id,
          safetyStock: 2, mallLink: `https://your-shop.com/search?q=${selectedItem.barcode}`,
          lastUpdated: serverTimestamp()
        });
      } else {
        await updateDoc(docRef, { currentStock: increment(changeQty), lastUpdated: serverTimestamp() });
      }
      setSelectedItem(null);
      setInputQty(1);
    } catch (err) { alert("권한이 없거나 오류가 발생했습니다."); }
  };

  if (loading) return <div className="center-container">로딩 중...</div>;
  if (!user) return <AuthPage />;

  if (!currentOrg) {
    return (
      <div className="org-container">
        <h2>🏢 조직 선택</h2>
        <div className="org-list">
          {userProfile?.orgs?.map(org => (
            <div key={org.id} onClick={() => setCurrentOrg(org)} className="org-card">
              <strong>{org.name}</strong> <span className="role-tag">{org.role}</span>
            </div>
          ))}
        </div>
        <div className="button-row">
          <button onClick={handleCreateOrg} className="green-button">+ 새 조직</button>
          <button onClick={handleJoinOrg} className="blue-button">🔗 코드 합류</button>
        </div>
        <button onClick={() => signOut(auth)} className="logout-link">로그아웃</button>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <button onClick={() => setCurrentOrg(null)} className="back-button">◀</button>
        <div style={{ textAlign: 'right' }}>
          <div className="active-org-text">{currentOrg.name}</div>
          <div className="user-email-text">{user.email}</div>
        </div>
      </header>

      <div className="search-section">
        <input placeholder="검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" />
      </div>

      <div className="product-list">
        {products.filter(p => p.name.includes(searchTerm)).map(p => (
          <div key={p.id} onClick={() => {setSelectedItem(p); setInputQty(1);}} className="product-item">
            <div>
              <div style={{ fontWeight: 'bold' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{p.barcode}</div>
            </div>
            <div style={{ color: p.currentStock <= p.safetyStock ? 'red' : '#333' }}>
              <strong>{p.currentStock}</strong> 개
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setIsScannerOpen(true)} className="floating-scan-btn">📷 스캔하기</button>

      {(isScannerOpen || selectedItem) && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isScannerOpen && !selectedItem ? (
              <div style={{ width: '100%' }}>
                <h3 style={{ textAlign: 'center' }}>바코드 스캔</h3>
                <div id="reader"></div>
                <button onClick={() => setIsScannerOpen(false)} className="close-modal-btn" style={{width: '100%', marginTop: '10px'}}>취소</button>
              </div>
            ) : (
              <div className="editor-container">
                <h3 style={{ margin: 0 }}>{selectedItem.name}</h3>
                <p style={{ fontSize: '12px', color: '#888' }}>현재 재고: {selectedItem.currentStock}개</p>
                <div className="qty-row">
                  <button onClick={() => setInputQty(q => Math.max(1, q-1))} className="circle-qty-btn">-</button>
                  <input type="number" value={inputQty} onChange={e => setInputQty(Number(e.target.value))} className="qty-display-input" />
                  <button onClick={() => setInputQty(q => q+1)} className="circle-qty-btn">+</button>
                </div>
                <div className="button-row">
                  <button onClick={() => processStock('IN')} className="green-button">입고 (+)</button>
                  <button onClick={() => processStock('OUT')} className="blue-button">출고 (-)</button>
                </div>
                {selectedItem.currentStock <= 2 && (
                  <button onClick={() => window.open(selectedItem.mallLink, '_blank')} className="mall-order-btn">🛒 쇼핑몰에서 주문</button>
                )}
                <button onClick={() => setSelectedItem(null)} className="close-modal-btn">닫기</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;