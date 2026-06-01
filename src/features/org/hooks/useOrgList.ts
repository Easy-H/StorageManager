import { useEffect, useState } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { OrgMembership, OrgRole } from '../types';

export const useOrgList = (
    user: { uid: string } | null,
    onLoading: (isLoading: boolean) => void,
    notice: (msg: string) => void,
    setCurrentOrg: (org: OrgMembership) => void,
    navigate: (path: string) => void
) => {
    const [orgs, setOrgs] = useState<OrgMembership[] | null>(null);
    const [internalLoading, setInternalLoading] = useState(true);

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

    return {
        orgs,
        internalLoading,
        handleSelectOrg
    };
};