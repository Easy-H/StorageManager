import React, { useState, useEffect } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, styles } from '../../../styles';


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

        <View style={styles.orgList}>
            {
                orgs?.length > 0 ? (
                    orgs.map(o => (
                        <View key={o.id} onClick={() => handleSelectOrg(o)} style={[styles.orgCard, { cursor: 'pointer', padding: 15, border: '1px solid #eee', borderRadius: 10, marginBottom: 10 }]}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                <Text style={{fontSize: 16, fontWeight: 'bolder', color: Colors.primary}}>{o.name}</Text>
                                <Text style={{ color: '#888', fontSize: 10, background: '#f0f0f0', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 }}>
                                    {o.level >= 100 ? "admin" : "member"}
                                </Text>
                            </View>
                            <View style={{ fontSize: '11px', color: '#aaa', marginTop: '6px', fontFamily: 'monospace' }}>
                                ID: {o.id}
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: '#999', margin: '20px 0', textAlign: 'center' }}>소속된 조직이 없습니다.</Text>
                )}
        </View>
    )
}

export const localStyle = StyleSheet.create({

});

export default OrgList;