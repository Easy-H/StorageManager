import { useState, useEffect } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { OrgMember, OrgMembership } from '../types';
import type { User } from 'firebase/auth';

export const useOrgManage = (
  currentOrg: OrgMembership, 
  setCurrentOrg: (org: OrgMembership) => void, 
  notice: (message: string) => void,
  user: User | null,
  onBack: () => void
) => {
  const [members, setMembers] = useState<OrgMember[]>([]);

  useEffect(() => {
    if (!currentOrg.id) return;

    const unsubscribe = OrgAPI.subscribeMembers(currentOrg.id, (memberList) => {
      setMembers(memberList);
    });

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
  };

  const removeMember = (member: OrgMember) => {
    OrgAPI.removeMember(currentOrg.id, member.uid);
  };

  const updateOrgName = async (newName: string) => {
    try {
      await OrgAPI.updateOrgName(currentOrg.id, newName);
      setCurrentOrg({ ...currentOrg, name: newName });
      notice("변경됨");
    } catch (e) {
      notice("변경 실패");
    }
  };

  const upgradeMemberLevel = async (targetMember: OrgMember, currentRole: 'admin' | 'member') => {
    if (!user || targetMember.uid === user.uid) {
      return notice("자신의 권한은 직접 변경할 수 없습니다.");
    }

    const isUpgrading = currentRole !== 'admin';
    const targetRoleName = isUpgrading ? '관리자' : '멤버';
    const targetLevel = isUpgrading ? 100 : 10;

    if (!window.confirm(`${targetMember.name || targetMember.email}님을 ${targetRoleName}로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await OrgAPI.updateMemberLevel(currentOrg.id, targetMember.uid, targetLevel);
      notice("권한이 변경되었습니다.");
    } catch (e) {
      notice("권한 변경 실패");
    }
  };

  return { members, deleteOrg, removeMember, updateOrgName, upgradeMemberLevel };
};