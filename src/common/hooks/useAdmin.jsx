import { useState } from 'react';
import { FirebaseOrgRepository as OrgAPI } from '../../features/org/api/FirebaseOrgRepository';

export function useAdmin(notice) {
  const [loading, setLoading] = useState(false);

  const createNewOrg = async (name, email, onSuccess) => {
    if (!name || !email) return notice("이름과 이메일을 입력하세요.");
    setLoading(true);
    try {
      await OrgAPI.createOrg(name, email);
      notice("조직이 생성되었습니다.");
      if (onSuccess) onSuccess();
    } catch (e) { notice("생성 실패"); }
    setLoading(false);
  };

  const removeOrg = async (org, onSuccess) => {
    if (!window.confirm(`[${org.name}] 조직을 삭제하시겠습니까? 데이터가 복구되지 않습니다.`)) return;
    try {
      await OrgAPI.deleteOrg(org.id);
      notice("조직 삭제 완료");
      if (onSuccess) onSuccess();
    } catch (e) { notice("삭제 실패"); }
  };

  return { createNewOrg, removeOrg, loading };
}