import React from 'react';

const OrgSelector = ({ user, userProfile, onSelectOrg, onOrgAction, onLogout }) => (
    <div className="org-container">
        <div className="app-header">
            {/* 상단 프로필 및 로그아웃 영역 */}
            <h2>🏢 내 조직 목록</h2>
        </div>
        <div className="org-list-scroll">
            {userProfile?.orgs?.length > 0 ? (
                userProfile.orgs.map(o => (
                    <div key={o.id} onClick={() => onSelectOrg(o)} className="org-card">
                        <strong>{o.name}</strong> <small>{o.role}</small>
                    </div>
                ))
            ) : <p style={{ color: '#999', margin: '20px 0' }}>소속된 조직이 없습니다.</p>}
        </div>

        <div className="button-row" style={{ marginTop: '20px' }}>
            <button onClick={() => onOrgAction('create')} className="green-button">조직 생성</button>
            <button onClick={() => onOrgAction('join')} className="blue-button">조직 참여</button>
        </div>
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
            <button
                onClick={onLogout}
                className="link-button"
                style={{ color: '#ff4d4f', fontSize: '13px' }}
            >
                로그아웃
            </button>
        </div>

    </div>
);

export default OrgSelector;