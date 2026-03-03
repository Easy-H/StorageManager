import React, { useState } from 'react';
import './App.css';

// 파이어베이스 관련
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// 훅 및 페이지 분리
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import AuthPage from './pages/AuthPage';
import OrgSelector from './pages/OrgSelector';
import StoragePage from './pages/StoragePage';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, userProfile, loading } = useAuth();
  const [currentOrg, setCurrentOrg] = useState(null);
  const products = useProducts(currentOrg?.id);

  // 현재 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState("storage");

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      await signOut(auth);
      window.location.reload();
    }
  };

  const handleOrgAction = async (action) => {
    const val = prompt(action === 'create' ? "새 조직 이름:" : "참여할 조직 코드:");
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
    <div className="main-container" style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>

      {/* 1. 메인 콘텐츠 영역 (하단 탭 높이만큼 여백 확보) */}
      <main className="tab-content" style={{ paddingBottom: '70px' }}>
        {activeTab === "dashboard" ? (
          <Dashboard
            products={products}
            currentOrg={currentOrg}
            onBackToOrgSelector={() => setCurrentOrg(null)}
          />
        ) : (
          <StoragePage
            products={products}
            currentOrg={currentOrg}
            onBackToOrgSelector={() => setCurrentOrg(null)}
          />
        )}
      </main>

      {/* 2. 하단 고정 탭 네비게이션 */}
      <nav className="bottom-nav" style={{
        display: 'flex',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        zIndex: 50
      }}>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            color: activeTab === 'dashboard' ? '#4a90e2' : '#bbb',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '2px' }}>📊</span>
          <span style={{ fontSize: '11px', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal' }}>대시보드</span>
        </button>

        <button
          onClick={() => setActiveTab("storage")}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            color: activeTab === 'storage' ? '#4a90e2' : '#bbb',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '2px' }}>📦</span>
          <span style={{ fontSize: '11px', fontWeight: activeTab === 'storage' ? 'bold' : 'normal' }}>재고관리</span>
        </button>
      </nav>
    </div>
  );
}

export default App;