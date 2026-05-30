import type { User } from 'firebase/auth';
import { UserProfile } from '../../auth/types';
import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';

export const useOrg = (notice: (message: string) => void, user: User | null, userProfile?: UserProfile) => {
  const orgJoin = async (orgId: string) => {
    if (!user) {
      notice("로그인 정보가 없습니다.");
      return;
    }
    try {
      await OrgAPI.joinOrg(orgId, user, userProfile);
      notice("완료되었습니다. 페이지를 새로고침합니다.");
      window.location.reload();
    } catch (e) {
      notice("오류가 발생했습니다.");
      console.error(e);
    }
  };

  const orgCreate = async (name: string) => {
    if (!user) {
      notice("로그인 정보가 없습니다.");
      return;
    }
    try {
      await OrgAPI.createOrg(name, user, userProfile);
      notice("완료되었습니다. 페이지를 새로고침합니다.");
      window.location.reload();
    } catch (e) {
      notice("오류가 발생했습니다.");
      console.error(e);
    }
  };

  return { orgJoin, orgCreate };
};