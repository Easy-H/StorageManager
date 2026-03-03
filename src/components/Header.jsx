import React from 'react';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Header = ({ currentOrg, onBackToOrgSelector }) => {
    const { toast, showToast } = useToast();
    const handleCopyOrgId = (id) => {
    navigator.clipboard.writeText(id)
      .then(() => showToast("조직 코드가 복사되었습니다!")) // alert 대신 사용
      .catch(() => showToast("복사 실패"));
  };

  return (
    <header className="app-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 15px', 
      borderBottom: '1px solid #eee',
      backgroundColor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <button onClick={onBackToOrgSelector} className="back-button">◀ 조직변경</button>
      <div onClick={() => handleCopyOrgId(currentOrg.id)} style={{ cursor: 'pointer', textAlign: 'right' }}>
        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{currentOrg.name} 📋</div>
        <div style={{ fontSize: '10px', color: '#888' }}>ID: {currentOrg.id}</div>
      </div>
    </header>
  );
};

export default Header;