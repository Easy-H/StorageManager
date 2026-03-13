import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import React, { useState, useEffect } from 'react';

export const useOrgManage = (currentOrg, notice) => {

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

    const deleteOrg = async () => {
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

    }

    const removeMember = (member) => {
        OrgAPI.removeMember(currentOrg.id, member.uid);
    }

    const updateOrgName = async (newName) => {
        await OrgAPI.updateOrgName(currentOrg.id, newName);
        notice("변경됨");
    }

    const upgradeMemberLevel = async (targetMember, currentRole) => {
        if (targetMember.uid === user.uid) {
            return notice("자신의 권한은 직접 변경할 수 없습니다.");
        }

        const targetRole = currentRole === 'admin' ? 'member' : 'admin';
        const targetLevel = targetRole === 'admin' ? 100 : 10;

        if (!window.confirm(`${targetMember.userName || targetMember.email}님을 ${targetRole === 'admin' ? '관리자' : '멤버'}로 변경하시겠습니까?`)) return;

        try {
            await OrgAPI.updateMemberLevel(currentOrg.id, targetMember.uid, targetLevel);
            notice("권한이 변경되었습니다.");
        } catch (e) {
            notice("권한 변경 실패");
        }

    }

    return { members, deleteOrg, removeMember, updateOrgName, upgradeMemberLevel };
};