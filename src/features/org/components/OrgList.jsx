import React, { useState, useEffect } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../../styles';


const OrgList = ({ user, navigate, setCurrentOrg, onLoading, notice }) => {

    const [orgs, setOrgs] = useState([]); // 조직 목록 상태

    useEffect(() => {
        const fetchOrgs = async () => {
            if (!user?.uid) return;
            try {
                onLoading(true);
                // API 호출: 유저 ID를 전달하여 서브 컬렉션 목록을 가져옴
                const myOrgs = await OrgAPI.getMyOrgs(user.uid);
                setOrgs(myOrgs);
            } catch (e) {
                console.error("조직 로드 실패:", e);
                notice("조직 목록을 불러오지 못했습니다.");
            } finally {
                onLoading(false);
            }
        };

        fetchOrgs();
    }, [user?.uid]);


    // 💡 2. 조직 선택 핸들러
    const handleSelectOrg = (org) => {
        // level이 0(Pending)이면 입장 불가 처리
        if (org.level === -1) {
            notice("승인 대기 중인 조직입니다. 관리자의 승인을 기다려주세요.");
            return;
        }
        setCurrentOrg(org);
        sessionStorage.setItem('currentOrg', JSON.stringify(org));
        navigate('/storage');
    };

    return (

        <div className="org-list">
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
    )
}

export const localStyle = StyleSheet.create({

});

export default OrgList;