import { FirebaseOrgRepository as OrgAPI } from '../api/FirebaseOrgRepository';

export const useOrg = (notice) => {

    const orgJoin = async () => {
        try {
            await OrgAPI.joinOrg(val, user, userProfile);
            notice("완료되었습니다. 페이지를 새로고침합니다.");
            window.location.reload();
        } catch (e) {
            notice("오류가 발생했습니다.");
            console.error(e);
        }
    };
    
    const orgCreate = async () => {
        try {
            await OrgAPI.createOrg(val, user, userProfile);
            notice("완료되었습니다. 페이지를 새로고침합니다.");
            window.location.reload();
        } catch (e) {
            notice("오류가 발생했습니다.");
            console.error(e);
        }

    };

    return { orgJoin, orgCreate };
};