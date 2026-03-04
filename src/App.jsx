import React, { useMemo, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// 추상화된 API
import { FirebaseAuthRepository as AuthAPI } from './api/FirebaseAuthRepository';
import { FirebaseOrgRepository as OrgAPI } from './api/FirebaseOrgRepository';

// 훅 및 페이지
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import { useToast } from './hooks/useToast';
import AuthPage from './pages/AuthPage';
import OrgSelectPage from './pages/OrgSelectPage';
import StoragePage from './pages/StoragePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import Toast from './components/Toast';

/**
 * 라우팅 로직이 포함된 실제 앱 콘텐츠
 */
function AppContent() {
  const { user, userProfile, loading } = useAuth();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 💡 초기값 로드: sessionStorage에서 이전에 선택한 조직 정보를 가져옴
  const [currentOrg, setCurrentOrg] = useState(() => {
    const savedOrg = sessionStorage.getItem('currentOrg');
    return savedOrg ? JSON.parse(savedOrg) : null;
  });

  // 현재 조직 아이디로 상품 구독
  const products = useProducts(currentOrg?.id);

  // 권한 체크: 현재 조직의 role이 admin이거나 시스템 전체 admin인 경우
  const hasAdminAccess = useMemo(() => {
    return currentOrg?.role === 'admin' || userProfile?.role === 'admin';
  }, [currentOrg, userProfile]);

  // 💡 조직 선택 핸들러: 선택 정보를 세션에 저장
  const handleSelectOrg = (org) => {
    setCurrentOrg(org);
    sessionStorage.setItem('currentOrg', JSON.stringify(org));
    navigate('/storage');
  };

  // 💡 조직 나가기 핸들러: 세션 정보 삭제 및 루트로 이동
  const handleExitOrg = () => {
    setCurrentOrg(null);
    sessionStorage.removeItem('currentOrg');
    navigate('/');
  };

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      sessionStorage.removeItem('currentOrg'); // 로그아웃 시 세션 비우기
      await AuthAPI.signOut();
      window.location.reload();
    }
  };

  const handleOrgAction = async (action) => {
    const val = prompt(action === 'create' ? "새 조직 이름:" : "참여할 조직 코드:");
    if (!val) return;
    try {
      if (action === 'create') {
        await OrgAPI.createOrg(val, user.email, user);
      } else {
        await OrgAPI.joinOrg(val, user.email, user);
      }
      showToast("완료되었습니다. 다시 로그인하거나 페이지를 새로고침하세요.");
      window.location.reload();
    } catch (e) {
      showToast("오류가 발생했습니다.");
      console.log(e);
    }
  };

  if (loading) return <div className="center-container">로딩 중...</div>;
  if (!user) return (
    <>
      <AuthPage notice={showToast} />
      <Toast message={toast.message} show={toast.show} />
    </>
    );

  // 1. 조직 선택 전
  if (!currentOrg) {
    return (
    <>
      <OrgSelectPage
        user={user}
        userProfile={userProfile}
        onSelectOrg={handleSelectOrg}
        onOrgAction={handleOrgAction}
        onLogout={handleLogout}
        notice={showToast}
      />
      <Toast message={toast.message} show={toast.show} />
    </>
    );
  }

  // 2. 조직 선택 후 메인 화면 레이아웃
  return (
    <div className="main-container" style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>

      <main className="tab-content" style={{ paddingBottom: '70px' }}>
        <Routes>
          <Route path="/dashboard" element={
            <DashboardPage products={products} currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} />
          } />

          <Route path="/storage" element={
            <StoragePage products={products} currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} />
          } />

          <Route path="/admin" element={
            hasAdminAccess ? (
              <AdminPage onBack={handleExitOrg} currentOrg={currentOrg} user={user} notice={showToast} onExitOrg={handleExitOrg} />
            ) : (
              <Navigate to="/storage" replace />
            )
          } />

          {/* 기본 경로 처리 */}
          <Route path="/" element={<Navigate to="/storage" replace />} />
          <Route path="*" element={<Navigate to="/storage" replace />} />
        </Routes>

        <Toast message={toast.message} show={toast.show} />
      </main>

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav" style={bottomNavStyle}>
        <TabButton
          active={location.pathname === '/dashboard'}
          onClick={() => navigate("/dashboard")}
          icon="📊" label="현황"
        />
        <TabButton
          active={location.pathname === '/storage'}
          onClick={() => navigate("/storage")}
          icon="📦" label="재고"
        />
        {hasAdminAccess && (
          <TabButton
            active={location.pathname === '/admin'}
            onClick={() => navigate("/admin")}
            icon="⚙️" label="관리"
          />
        )}
      </nav>
    </div>
  );
}

/**
 * HashRouter를 사용하여 GitHub Pages 새로고침 이슈 해결
 */
function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

// 스타일 및 공통 버튼 컴포넌트
const bottomNavStyle = {
  display: 'flex', position: 'fixed', bottom: 0, left: 0, right: 0,
  height: '65px', backgroundColor: '#fff', borderTop: '1px solid #eee',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', zIndex: 50
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'none', color: active ? '#4a90e2' : '#bbb', transition: 'all 0.2s',
    cursor: 'pointer'
  }}>
    <span style={{ fontSize: '20px', marginBottom: '2px' }}>{icon}</span>
    <span style={{ fontSize: '11px', fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
  </button>
);

export default App;