import React, { useState, useEffect } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { OrgMembership, OrgRole } from '../types';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import OrgListItem from './OrgListItem';

interface User {
    uid: string;
}

interface OrgListProps {
    user: User | null;
    navigate: (path: string) => void;
    setCurrentOrg: (org: OrgMembership) => void;
    onLoading: (isLoading: boolean) => void;
    notice: (msg: string) => void;
}

const OrgList = ({ user, navigate, setCurrentOrg, onLoading, notice }: OrgListProps) => {

    const [orgs, setOrgs] = useState<OrgMembership[] | null>(null); // 조직 목록 상태
    const [internalLoading, setInternalLoading] = useState(true); // 내부 로딩 상태 추가

    useEffect(() => {
        const fetchOrgs = async () => {
            if (!user?.uid) return;
            try {
                onLoading(true);
                setInternalLoading(true);
                // API 호출: 유저 ID를 전달하여 서브 컬렉션 목록을 가져옴
                const myOrgs = await OrgAPI.getMyOrgs(user.uid);
                setOrgs(myOrgs);
            } catch (e) {
                console.error("조직 로드 실패:", e);
                notice("조직 목록을 불러오지 못했습니다.");
            } finally {
                onLoading(false);
                setInternalLoading(false);
            }
        };

        fetchOrgs();
    }, [user?.uid]);


    // 💡 2. 조직 선택 핸들러
    const handleSelectOrg = (org: OrgMembership) => {
        // level이 0(Pending)이면 입장 불가 처리
        if (org.level === OrgRole.PENDING) {
            notice("승인 대기 중인 조직입니다. 관리자의 승인을 기다려주세요.");
            return;
        }
        setCurrentOrg(org);
        sessionStorage.setItem('currentOrg', JSON.stringify(org));
        navigate('/storage');
    };

    return (

        <View style={localStyles.orgList}>
            {internalLoading ? (
                <Text style={{ color: '#999', marginVertical: 20, textAlign: 'center' }}>조직 목록을 불러오는 중...</Text>
            ) : (
                orgs && orgs.length > 0 ? ( // orgs가 null이 아닌 경우에만 length 속성에 접근
                    orgs.map(o => (
                        <OrgListItem key={o.id} org={o} onSelect={handleSelectOrg} />
                    ))
                ) : (
                    <Text style={{ color: '#999', marginVertical: 20, textAlign: 'center' }}>소속된 조직이 없습니다.</Text>
                )
            )}
        </View>
    )
}

export const localStyles = StyleSheet.create({
    orgList: {
        width: '100%',
        gap: 12,
    } as ViewStyle,
});

export default OrgList;