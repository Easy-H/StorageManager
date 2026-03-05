import React, { useState, useEffect } from 'react';

import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';

function OrgSelectPage({ user, userProfile, setCurrentOrg, onLogout, navigate, notice }) {
  const [orgs, setOrgs] = useState([]); // 조직 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 💡 1. 컴포넌트 마운트 시 조직 목록 로드
  useEffect(() => {
    const fetchOrgs = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        // API 호출: 유저 ID를 전달하여 서브 컬렉션 목록을 가져옴
        const myOrgs = await OrgAPI.getMyOrgs(user.uid);
        setOrgs(myOrgs);
      } catch (e) {
        console.error("조직 로드 실패:", e);
        notice("조직 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, [user?.uid]);

  // 💡 2. 조직 선택 핸들러
  const handleSelectOrg = (org) => {
    // level이 0(Pending)이면 입장 불가 처리
    if (org.level === 0) {
      notice("승인 대기 중인 조직입니다. 관리자의 승인을 기다려주세요.");
      return;
    }
    setCurrentOrg(org);
    sessionStorage.setItem('currentOrg', JSON.stringify(org));
    navigate('/storage');
  };

  const handleOrgAction = async (action) => {
    const val = prompt(action === 'create' ? "새 조직 이름:" : "참여할 조직 코드:");
    if (!val) return;
    try {
      if (action === 'create') {
        await OrgAPI.createOrg(val, user, userProfile);
      } else {
        await OrgAPI.joinOrg(val, user, userProfile);
      }
      notice("완료되었습니다. 페이지를 새로고침합니다.");
      window.location.reload();
    } catch (e) {
      notice("오류가 발생했습니다.");
      console.error(e);
    }
  };


  return (
    <div className="org-container">
      <div className="app-header">
        <h2>🏢 내 조직 목록</h2>
      </div>
      <div className="org-list-scroll">
        {
          orgs?.length > 0 ? (
            orgs.map(o => (
              <div key={o.id} onClick={() => handleSelectOrg(o)} className="org-card" style={{ cursor: 'pointer', padding: '15px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{o.name}</strong>
                  <small style={{ color: '#888', fontSize: '10px', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                    {o.level >= 100 ? "admin" : "member"}
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
        <button onClick={() => handleOrgAction('create')} className="green-button" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>조직 생성</button>
        <button onClick={() => handleOrgAction('join')} className="blue-button" style={{ flex: 1, padding: '12px', borderRadius: '8px' }}>조직 참여</button>
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
}

export default OrgSelectPage;