import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { Colors } from '../../styles';

/**
 * 탭 버튼 컴포넌트 (RN 스타일)
 */
interface TabButtonProps {
  active: boolean;
  onPress: () => void;
  icon: string;
  label: string;
}

const TabButton: FC<TabButtonProps> = ({ active, onPress, icon, label }) => (
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
    zIndex: 50,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

interface BottomNavProps {
  hasAdminAccess: boolean;
}

const BottomNav: FC<BottomNavProps> = ({ hasAdminAccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
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
      <TabButton
        active={location.pathname === '/todo'}
        onPress={() => navigate("/todo")}
        icon="📦" label="할 일"
      />
      {hasAdminAccess && (
        <TabButton
          active={location.pathname === '/admin'}
          onPress={() => navigate("/admin")}
          icon="⚙️" label="관리"
        />
      )}
    </View>
  );
};

export default BottomNav;