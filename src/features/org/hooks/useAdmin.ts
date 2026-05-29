import { useState } from 'react';
import type { User } from 'firebase/auth';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';
import { Org } from '../types';

type NoticeFunction = (message: string) => void;
type SuccessCallback = () => void;

export function useAdmin(notice: NoticeFunction) {
  const [loading, setLoading] = useState<boolean>(false);

  const createNewOrg = async (name: string, admin: User, onSuccess?: SuccessCallback): Promise<void> => {
    if (!name || !admin) {
      return notice("이름과 관리자 정보가 필요합니다.");
    }
    setLoading(true);
    try {
      await OrgAPI.createOrg(name, admin);
      notice("조직이 생성되었습니다.");
      onSuccess?.();
    } catch (e) { notice("생성 실패"); }
    setLoading(false);
  };

  const removeOrg = async (org: Org, onSuccess?: SuccessCallback): Promise<void> => {
    if (!window.confirm(`[${org.name}] 조직을 삭제하시겠습니까? 데이터가 복구되지 않습니다.`)) return;
    try {
      await OrgAPI.deleteOrg(org.id);
      notice("조직 삭제 완료");
      onSuccess?.();
    } catch (e) { notice("삭제 실패"); }
  };

  return { createNewOrg, removeOrg, loading };
}