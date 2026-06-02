import { FC, useMemo, useState, useEffect } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

// 아까 만든 styles.js 임포트
import './App.css';
import { styles } from './styles';

import BottomNav from './common/components/BottomNav';
import Header from './common/components/Header';
import Toast from './common/components/Toast';
import { useToast } from './common/hooks/useToast';

import { OrgMembership } from './features/org/types';
// 기존 API 및 훅 (그대로 유지)
import { FirebaseAuthRepository as AuthAPI } from './features/auth/api/FirebaseAuthRepository';
import { useAuth } from './features/auth/hooks/useAuth';
import { useProducts } from './features/product/hooks/useProducts';
import { TodoProvider } from './features/todo/contexts/TodoContext';

// 페이지 및 컴포넌트
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import OrgSelectPage from './pages/OrgSelectPage';
import StoragePage from './pages/StoragePage';
import ShopPage from './pages/ShopPage';
import TodoPage from './pages/TodoPage';

interface UserProfile {
  level: number;
}

const AppContent: FC = () => {
  const { user, userProfile, loading } = useAuth() as { user: any; userProfile: UserProfile | null; loading: boolean };
  const { toast, showToast } = useToast();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<OrgMembership | null>(() => {
    const savedOrg = sessionStorage.getItem('currentOrg');
    return savedOrg ? JSON.parse(savedOrg) : null;
  });

  // currentOrg 상태가 변경될 때마다 sessionStorage를 동기화합니다.
  useEffect(() => {
    if (currentOrg) {
      sessionStorage.setItem('currentOrg', JSON.stringify(currentOrg));
    } else {
      sessionStorage.removeItem('currentOrg');
    }
  }, [currentOrg]);

  const products = useProducts(currentOrg?.id);

  const hasAdminAccess = useMemo((): boolean => {
    return (currentOrg?.level ?? 0) >= 100 || (userProfile?.level ?? 0) >= 100;
  }, [currentOrg, userProfile]);

  const handleExitOrg = () => {
    setCurrentOrg(null);
    sessionStorage.removeItem('currentOrg');
    navigate('/');
  };

  const handleLogout = async () => {
    // 웹/앱 호환성을 위해 window.confirm 대신 간단한 처리 또는 RN Alert 사용
    const proceed = window.confirm("로그아웃 하시겠습니까?");
    if (proceed) {
      sessionStorage.removeItem('currentOrg');
      await AuthAPI.signOut();
      window.location.reload();
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }


  // 1. 조직 선택 전
  if (!currentOrg) {
    return (
      <>
        {(showAuth && !user) ? (
          <AuthPage notice={showToast} onBack={() => setShowAuth(false)} />
        ) : (
        <OrgSelectPage
          user={user}
          userProfile={userProfile}
          onLogout={handleLogout}
          onLogin={() => setShowAuth(true)}
          notice={showToast}
          navigate={navigate}
          setCurrentOrg={setCurrentOrg}
        />
        )}
        <Toast message={toast.message} show={toast.show} />
      </>
    );
  }

  // 2. 조직 선택 후 (메인 레이아웃)
  return (
    <>
      {/* 메인 콘텐츠 영역 (TabContent 역할) */}
      <View style={{ flex: 1, paddingBottom: 65 }}>
        <Header currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} />
        <Routes>
          <Route path="/dashboard" element={
            <DashboardPage products={products} currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} />
          } />
          <Route path="/storage" element={
            <StoragePage products={products} currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} />
          } />
          <Route path="/shop" element={
            <ShopPage products={products} currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} />
          } />
          <Route path="/admin" element={
            hasAdminAccess ? (
              <AdminPage onBack={handleExitOrg} currentOrg={currentOrg} user={user} notice={showToast} setCurrentOrg={setCurrentOrg as any} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />
          <Route path="/todo" element={
            <TodoProvider orgId={ currentOrg!.id } notice={showToast}>
              <TodoPage currentOrg={currentOrg} onBack={handleExitOrg} notice={showToast} products={products}/>
            </TodoProvider>
            }/>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </View>

      <BottomNav hasAdminAccess={hasAdminAccess} />

      <Toast message={toast.message} show={toast.show} />
    </>
  );
}

const App: FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;