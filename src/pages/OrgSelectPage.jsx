import React from 'react';

const OrgSelectPage = ({ user, userProfile, onSelectOrg, onOrgAction, onLogout }) => (
  <div className="org-container">
    <div className="app-header">
        <h2>🏢 내 조직 목록</h2>
    </div>
    <div className="org-list-scroll">
      {userProfile?.orgs?.length > 0 ? (
        userProfile.orgs.map(o => (
          <div key={o.id} onClick={() => onSelectOrg(o)} className="org-card" style={{ cursor: 'pointer', padding: '15px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{o.name}</strong>
              <small style={{ color: '#888', fontSize: '10px', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                {o.role}
              </small>
            </div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px', fontFamily: 'monospace' }}>
              ID: {o.id}
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: '#999', margin: '20px 0', textAlign: 'center' }}>소속된 조직이 없습니다.</p>
      )}
    </div>

    <div className="button-row" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <button onClick={() => onOrgAction('create')} className="green-button" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>조직 생성</button>
      <button onClick={() => onOrgAction('join')} className="blue-button" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>조직 참여</button>
    </div>
    {/* 상단 프로필 및 로그아웃 영역 */}
    <div className="profile-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '15px',
      borderBottom: '1px solid #eee'
    }}>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '12px', color: '#888' }}>로그인 계정</div>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.email}</div>
      </div>
      {/* 이 부분의 </button> 태그가 </div>로 되어 있었을 수 있습니다 */}
      <button 
        onClick={onLogout} 
        className="link-button" 
        style={{ color: '#ff4d4f', fontSize: '13px', border: 'none', background: 'none', cursor: 'pointer' }}
      >
        로그아웃
      </button> 
    </div>
  </div>
);

export default OrgSelectPage;