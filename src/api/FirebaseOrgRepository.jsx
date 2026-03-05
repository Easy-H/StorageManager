import { db } from './firebase';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, 
  getDocs, query, serverTimestamp, getDoc, writeBatch
} from 'firebase/firestore';

export const FirebaseOrgRepository = {
  
  // 권한 레벨 정의 (참고용)
  ROLES: {
    PENDING: 0,
    MEMBER: 10,
    MANAGER: 50,
    ADMIN: 100
  },

  /**
   * 1. 내 소속 조직 목록 가져오기
   */
  async getMyOrgs(userId) {
    if (!userId) return [];
    try {
      const snap = await getDocs(collection(db, "users", userId, "organizations"));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("소속 조직 로드 실패:", error);
      return [];
    }
  },

  /**
   * 2. 신규 조직 생성
   */
  async createOrg(name, admin, adminProfile) {
    const batch = writeBatch(db);
    const newOrgRef = doc(collection(db, "organizations"));
    const orgId = newOrgRef.id;
    
    const userRef = doc(db, "users", admin.uid);
    const userOrgRef = doc(db, "users", admin.uid, "organizations", orgId);
    const memberRef = doc(db, "organizations", orgId, "members", admin.uid);

    const userName = adminProfile?.name || admin.email.split('@')[0];

    try {
      batch.set(userRef, {
        email: admin.email,
        name: userName, // 사용자 마스터 이름
        updatedAt: serverTimestamp()
      }, { merge: true });

      batch.set(newOrgRef, {
        name: name, // 조직 이름
        adminEmail: admin.email,
        adminUid: admin.uid,
        isActive: true,
        createdAt: serverTimestamp()
      });

      // 유저 개인 공간용 데이터 (조직 정보 위주)
      const userOrgData = {
        name: name, // 💡 name 대신 orgName으로 명확히 지정
        level: this.ROLES.ADMIN,
        joinedAt: serverTimestamp()
      };
      
      // 조직 멤버십용 데이터 (사용자 정보 위주)
      const memberData = {
        uid: admin.uid,
        email: admin.email,
        name: userName,
        level: this.ROLES.ADMIN,
        joinedAt: serverTimestamp()
      };

      batch.set(userOrgRef, userOrgData);
      batch.set(memberRef, memberData);

      await batch.commit();
      return { id: orgId, name };
    } catch (error) {
      console.error("조직 생성 실패:", error);
      throw error;
    }
  },

  /**
   * 3. 조직 참여 신청 (수정 버전)
   */
  async joinOrg(orgId, user, userProfile) {
    const orgSnap = await getDoc(doc(db, "organizations", orgId));
    if (!orgSnap.exists()) throw new Error("존재하지 않는 조직입니다.");

    const orgName = orgSnap.data().name; // 조직 마스터에서 이름 가져옴
    const userName = userProfile?.name || user.email.split('@')[0];

    const batch = writeBatch(db);
    const userRef = doc(db, "users", user.uid);
    const userOrgRef = doc(db, "users", user.uid, "organizations", orgId);
    const memberRef = doc(db, "organizations", orgId, "members", user.uid);

    try {
      batch.set(userRef, {
        email: user.email,
        name: userName,
        updatedAt: serverTimestamp()
      }, { merge: true });

      const commonData = {
        name: orgName,
        level: this.ROLES.PENDING,
        requestedAt: serverTimestamp()
      };

      // 유저 쪽에는 조직 이름을, 조직 쪽에는 유저 이름을 명확히 저장
      batch.set(userOrgRef, commonData);
      batch.set(memberRef, {
        uid: user.uid,
        email: user.email,
        userName: userName, // 💡 멤버의 이름
        ...commonData
      });

      await batch.commit();
    } catch (error) {
      console.error("조직 참여 신청 실패:", error);
      throw error;
    }
  },

  /**
   * 4. 멤버 레벨 승인 및 변경 (관리자 전용)
   */
  async updateMemberLevel(orgId, targetUserId, newLevel) {
    const batch = writeBatch(db);
    const userOrgRef = doc(db, "users", targetUserId, "organizations", orgId);
    const memberRef = doc(db, "organizations", orgId, "members", targetUserId);
    
    try {
      const updateData = { 
        level: newLevel, 
        updatedAt: serverTimestamp() 
      };

      batch.update(userOrgRef, updateData);
      batch.update(memberRef, updateData);

      await batch.commit();
    } catch (error) {
      console.error("레벨 변경 실패:", error);
      throw error;
    }
  },

  /**
   * 5. 멤버 삭제/내보내기
   */
  async removeMember(orgId, targetUserId) {
    const batch = writeBatch(db);
    batch.delete(doc(db, "users", targetUserId, "organizations", orgId));
    batch.delete(doc(db, "organizations", orgId, "members", targetUserId));
    await batch.commit();
  },

  async getOrgMembers(orgId) {
    if (!orgId) return [];
    try {
      // 조직 문서 하위의 members 서브 컬렉션 참조
      const membersRef = collection(db, "organizations", orgId, "members");
      const snap = await getDocs(membersRef);
      
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("멤버 목록 로드 실패:", error);
      throw error;
    }
  },
  async deleteOrg(orgId) {
    const batch = writeBatch(db);
    
    try {
      // 1. 조직 마스터 비활성화
      const orgRef = doc(db, "organizations", orgId);
      batch.update(orgRef, {
        isActive: false,
        deletedAt: serverTimestamp()
      });

      // 2. 조직 내 모든 멤버 목록 가져오기
      const membersRef = collection(db, "organizations", orgId, "members");
      const membersSnap = await getDocs(membersRef);

      // 3. 데이터 처리
      membersSnap.forEach((mDoc) => {
        const memberUid = mDoc.id;
        
        // A. 조직 원본 멤버십은 '비활성화' (복구용 데이터 보존)
        const masterMemberRef = doc(db, "organizations", orgId, "members", memberUid);
        batch.update(masterMemberRef, { isActive: false });

        // B. 유저 개인 공간에서는 '삭제' (목록에서 즉시 제거)
        const userOrgRef = doc(db, "users", memberUid, "organizations", orgId);
        batch.delete(userOrgRef);
      });

      await batch.commit();
      console.log(`조직 ${orgId} 비활성화 및 유저 목록 정리 완료.`);
    } catch (error) {
      console.error("조직 삭제 중 오류 발생:", error);
      throw error;
    }
  }
};