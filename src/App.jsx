import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx'; // npm install xlsx 필요

// 파이어베이스 관련
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// 훅 및 컴포넌트
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import AuthPage from './components/AuthPage';
import ScannerModal from './components/ScannerModal';
import ProductDetailModal from './components/ProductDetailModal';
import OrgSelector from './components/OrgSelector';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';

function App() {
  const { user, userProfile, loading } = useAuth();
  const [currentOrg, setCurrentOrg] = useState(null);
  const products = useProducts(currentOrg?.id);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- [신규] 엑셀 다운로드 기능 ---
  const handleDownloadExcel = () => {
    if (!products || products.length === 0) return alert("다운로드할 데이터가 없습니다.");

    // 엑셀에 들어갈 데이터 행 구성
    const excelData = products.map(p => ({
      "품목명": p.name,
      "바코드": p.barcode || "N/A",
      "현재재고": p.currentStock,
      "안전재고": p.safetyStock || 0,
      "상태": p.currentStock <= (p.safetyStock || 0) ? "재고부족" : "정상",
      "최종업데이트": p.lastUpdated?.toDate().toLocaleString() || "-"
    }));

    // 워크북 및 시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "재고현황");

    // 파일 저장
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${currentOrg.name}_재고현황_${dateStr}.xlsx`);
  };

  // 로그아웃
  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      await signOut(auth);
      window.location.reload();
    }
  };

  // 조직 액션
  const handleOrgAction = async (action) => {
    const val = prompt(action === 'create' ? "조직 이름:" : "조직 코드:");
    if (!val) return;
    const id = action === 'create' ? `ORG_${Math.random().toString(36).substr(2, 6)}` : val;
    const userRef = doc(db, "users", user.uid);
    
    try {
      if (action === 'create') {
        await setDoc(doc(db, "organizations", id), { name: val, members: [user.uid] });
        await updateDoc(userRef, { orgs: arrayUnion({ id, name: val, role: 'admin' }), orgIds: arrayUnion(id) });
      } else {
        const snap = await getDoc(doc(db, "organizations", id));
        if (!snap.exists()) return alert("코드가 틀립니다.");
        await updateDoc(userRef, { orgs: arrayUnion({ id, name: snap.data().name, role: 'member' }), orgIds: arrayUnion(id) });
      }
      window.location.reload();
    } catch (e) { alert("오류 발생"); }
  };

  if (loading) return <div className="center-container">로딩 중...</div>;
  if (!user) return <AuthPage />;
  if (!currentOrg) return (
    <OrgSelector 
      user={user} userProfile={userProfile} 
      onSelectOrg={setCurrentOrg} onOrgAction={handleOrgAction} onLogout={handleLogout} 
    />
  );

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <button onClick={() => setCurrentOrg(null)} className="back-button">◀</button>
        <div style={{ textAlign: 'right' }}>
          <div className="active-org-text">{currentOrg.name}</div>
        </div>
      </header>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <ProductList 
        products={products} 
        searchTerm={searchTerm} 
        onSelectProduct={setSelectedItem} 
      />

      <div className="button-row-floating">
        <button 
          onClick={() => setSelectedItem({barcode:'', name:'', isNew:true, currentStock:0})} 
          className="green-button-pill"
        >
          ➕ 직접 추가
        </button>
        <button onClick={() => setIsScannerOpen(true)} className="floating-scan-btn">
          📷 바코드 스캔
        </button>
          {/* Admin일 때만 엑셀 버튼 노출 */}
          {currentOrg.role === 'admin' && (
            <button onClick={handleDownloadExcel} className="excel-download-btn">
              📊 엑셀 저장
            </button>
          )}
        
      </div>

      {isScannerOpen && (
        <ScannerModal 
          onScan={(text) => {
            const found = products.find(p => p.barcode === text);
            setSelectedItem(found || { barcode: text, name: "", isNew: true, currentStock: 0 });
            setIsScannerOpen(false);
          }} 
          onClose={() => setIsScannerOpen(false)} 
        />
      )}

      {selectedItem && (
        <ProductDetailModal 
          item={selectedItem} orgId={currentOrg.id} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

export default App;