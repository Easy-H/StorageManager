import React, { useState, useEffect } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import Header from '../components/Header';

const AdminPage = ({ currentOrg, notice, user, onBack }) => {
    const [newName, setNewName] = useState(currentOrg.name);
    const [members, setMembers] = useState([]);

    // [수정] 실시간 구독 연결
    useEffect(() => {
        if (!currentOrg.id) return;

        // 실시간 구독 시작
        const unsubscribe = OrgAPI.subscribeMembers(currentOrg.id, (memberList) => {
            setMembers(memberList);
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentOrg.id]);

    const handleChangeRole = async (targetMember, currentRole) => {
        if (targetMember.uid === user.uid) {
            return notice("자신의 권한은 직접 변경할 수 없습니다.");
        }

        const targetRole = currentRole === 'admin' ? 'member' : 'admin';
        const targetLevel = targetRole === 'admin' ? 100 : 10;

        if (!window.confirm(`${targetMember.userName || targetMember.email}님을 ${targetRole === 'admin' ? '관리자' : '멤버'}로 변경하시겠습니까?`)) return;

        try {
            await OrgAPI.updateMemberLevel(currentOrg.id, targetMember.uid, targetLevel);
            notice("권한이 변경되었습니다.");
            // 이제 fetchMembers()를 호출할 필요가 없습니다. (자동 갱신됨)
        } catch (e) { 
            notice("권한 변경 실패"); 
        }
    };

    const handleDeleteOrg = async () => {
        const confirmStr = `[${currentOrg.name}] 조직을 삭제하시겠습니까? 모든 데이터가 사라지며 복구할 수 없습니다.`;
        if (window.confirm(confirmStr)) {
            const finalCheck = prompt("삭제를 원하시면 조직 이름을 정확히 입력하세요:", "");
            if (finalCheck !== currentOrg.name) return notice("이름이 일치하지 않습니다.");

            try {
                await OrgAPI.deleteOrg(currentOrg.id);
                onBack();
                notice("조직이 삭제되었습니다.");
            } catch (e) {
                notice("삭제 중 오류 발생");
            }
        }
    };

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
            <div className="app-wrapper" style={{ padding: '20px', minHeight: 'calc(100vh - 60px)', backgroundColor: '#f9f9f9' }}>

                {/* 1. 조직 정보 수정 */}
                <h4 style={titleStyle}>조직 이름 변경</h4>
                <section style={sectionStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                            value={newName} 
                            onChange={e => setNewName(e.target.value)} 
                            className="input-basic" 
                            style={{ flex: 1 }}
                        />
                        <button 
                            onClick={() => OrgAPI.updateOrgName(currentOrg.id, newName).then(() => notice("변경됨"))} 
                            className="green-button" 
                            style={{ width: '80px', padding: '10px' }}
                        >
                            수정
                        </button>
                    </div>
                </section>

                {/* 2. 멤버 관리 */}
                <h4 style={titleStyle}>멤버 및 권한 관리</h4>
                <section style={sectionStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {members.map(member => {
                            const role = member.level == 100 ? 'admin' : 'member';
                            const isMe = member.uid === user.uid;
                            return (
                                <div key={member.uid} style={memberItemStyle}>
                                    <div>
                                        <span style={{ fontWeight: 'bold', color: '#242424' }}>
                                            {member.userName || member.name || member.email} {isMe && "(나)"}
                                        </span>
                                        <div style={{ fontSize: '12px', color: '#888' }}>
                                            {role === 'admin' ? '👑 관리자' : '👤 멤버'}
                                        </div>
                                    </div>
                                    {!isMe && (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => handleChangeRole(member, role)} style={roleBtnStyle}>
                                                {role === 'admin' ? '멤버로 강등' : '관리자로 승격'}
                                            </button>
                                            <button 
                                                onClick={() => OrgAPI.removeMember(currentOrg.id, member.uid)} 
                                                style={{ ...removeBtnStyle, color: 'red' }}
                                            >
                                                내보내기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. 위험 구역 */}
                <h4 style={{ ...titleStyle, color: '#ff4d4f', marginTop: '20px' }}>위험 구역</h4>
                <section style={{ ...sectionStyle, border: '1px solid #ffccc7', backgroundColor: '#fff2f0' }}>
                    <p style={{ fontSize: '12px', color: '#ff7875', marginBottom: '10px' }}>
                        조직을 삭제하면 재고 데이터와 모든 로그가 영구 삭제됩니다.
                    </p>
                    <button onClick={handleDeleteOrg} className="link-button" style={{ color: '#ff4d4f', fontWeight: 'bold', padding: 0 }}>
                        조직 전체 삭제하기
                    </button>
                </section>
            </div>
        </>
    );
};

// --- 스타일 객체 (기본 디자인 유지) ---
const sectionStyle = { 
    background: '#fff', 
    padding: '16px', 
    borderRadius: '12px', 
    marginBottom: '16px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #eeeeee'
};
const titleStyle = { marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 'bold', color: '#242424' };
const memberItemStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '8px 0', 
    borderBottom: '1px solid #f6f6f6' 
};
const roleBtnStyle = { 
    padding: '6px 10px', 
    fontSize: '12px', 
    cursor: 'pointer', 
    borderRadius: '6px', 
    border: '1px solid #ddd', 
    background: '#52c41a', 
    color: 'white',
    fontWeight: 'bold'
};
const removeBtnStyle = { 
    padding: '6px 10px', 
    fontSize: '12px', 
    cursor: 'pointer', 
    borderRadius: '6px', 
    border: '1px solid #ddd', 
    background: 'white' 
};

export default AdminPage;