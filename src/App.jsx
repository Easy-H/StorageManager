import React, { useMemo, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, Alert, StyleSheet, Dimensions } from 'react-native';

// 아까 만든 styles.js 임포트
import { styles, Colors } from './styles';
import './App.css'

// 기존 API 및 훅 (그대로 유지)
import { FirebaseAuthRepository as AuthAPI } from './features/auth/api/FirebaseAuthRepository';
import { useAuth } from './common/hooks/useAuth';
import { useProducts } from './features/product/hooks/useProducts';
import { useToast } from './common/hooks/useToast';

// 페이지 및 컴포넌트
import AuthPage from './pages/AuthPage';
import OrgSelectPage from './pages/OrgSelectPage';
import StoragePage from './pages/StoragePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import Toast from './common/components/Toast';

function AppContent() {
  const { user, userProfile, loading } = useAuth();
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentOrg, setCurrentOrg] = useState(() => {
    const savedOrg = sessionStorage.getItem('currentOrg');
    return savedOrg ? JSON.parse(savedOrg) : null;
  });

  const products = useProducts(currentOrg?.id);

  const hasAdminAccess = useMemo(() => {
    return currentOrg?.level >= 100 || userProfile?.level >= 100;
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

  // 비로그인 상태
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AuthPage notice={showToast} />
        <Toast message={toast.message} show={toast.show} />
      </SafeAreaView>
    );
  }

  // 1. 조직 선택 전
  if (!currentOrg) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <OrgSelectPage
          user={user}
          userProfile={userProfile}
          onLogout={handleLogout}
          notice={showToast}
          navigate={navigate}
          setCurrentOrg={setCurrentOrg}
        />
        <Toast message={toast.message} show={toast.show} />
      </SafeAreaView>
    );
  }

  // 2. 조직 선택 후 (메인 레이아웃)
  return (
    <View style={styles.appWrapper}>
      {/* 메인 콘텐츠 영역 (TabContent 역할) */}
      <View style={{ flex: 1, paddingBottom: 65 }}>
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
          <Route path="/" element={<Navigate to="/storage" replace />} />
          <Route path="*" element={<Navigate to="/storage" replace />} />
        </Routes>
      </View>

      {/* 하단 네비게이션 (Bottom Nav) */}
      <View style={navStyles.bottomNav}>
        <TabButton
          active={location.pathname === '/dashboard'}
          onPress={() => navigate("/dashboard")}
          icon="📊" label="현황"
        />
        <TabButton
          active={location.pathname === '/storage'}
          onPress={() => navigate("/storage")}
          icon="📦" label="재고"
        />
        {hasAdminAccess && (
          <TabButton
            active={location.pathname === '/admin'}
            onPress={() => navigate("/admin")}
            icon="⚙️" label="관리"
          />
        )}
      </View>

      <Toast message={toast.message} show={toast.show} />
    </View>
  );
}

/**
 * 탭 버튼 컴포넌트 (RN 스타일)
 */
const TabButton = ({ active, onPress, icon, label }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={navStyles.tabButton}
    activeOpacity={0.7}
  >
    <Text style={{ fontSize: 20, marginBottom: 2 }}>{icon}</Text>
    <Text style={{ 
      fontSize: 11, 
      fontWeight: active ? 'bold' : 'normal',
      color: active ? Colors.primary : '#bbb'
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 네비게이션 전용 추가 스타일
const navStyles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // 그림자 효과 (iOS/Android/Web 공통 대응은 styles.js 참고)
    zIndex: 50,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;