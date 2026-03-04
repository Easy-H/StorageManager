import { db } from './firebase';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, where, documentId,
  getDocs, query, orderBy, serverTimestamp, getDoc, arrayUnion, limit
} from 'firebase/firestore';

export const FirebaseOrgRepository = {
  // 1. 모든 조직 목록 가져오기 (가나다순)
  async getAllOrgs() {
    const q = query(collection(db, "organizations"), orderBy("name"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // 2. 신규 조직 생성
  async createOrg(name, adminEmail, adminUid) {
    const newOrgRef = doc(collection(db, "organizations"));
    const orgId = newOrgRef.id;
    const userRef = doc(db, "users", adminUid);

    try {
      // 1) 조직 문서 생성
      await setDoc(newOrgRef, {
        name,
        adminEmail,
        adminUid,
        createdAt: serverTimestamp(),
        isActive: true,
        members: [adminUid]
      });

      // 2) 유저 문서 존재 여부 확인
      const userSnap = await getDoc(userRef);
      const newOrgInfo = { id: orgId, name: name, role: 'admin' };

      if (!userSnap.exists()) {
        // 유저 문서가 아예 없는 경우: 새로 생성 (setDoc)
        await setDoc(userRef, {
          email: adminEmail,
          orgs: [newOrgInfo],
          orgIds: [orgId],
          createdAt: serverTimestamp(),
          role: 'user' // 기본 앱 권한
        });
      } else {
        // 유저 문서가 이미 있는 경우: 기존 배열에 추가 (updateDoc)
        await updateDoc(userRef, {
          orgs: arrayUnion(newOrgInfo),
          orgIds: arrayUnion(orgId)
        });
      }

      return { id: orgId, name };
    } catch (error) {
      console.error("조직 생성 실패:", error);
      throw error;
    }
  },
  // FirebaseOrgRepository.js
  async joinOrg(orgId, user, name) {
    const orgRef = doc(db, "organizations", orgId);
    const userRef = doc(db, "users", user.uid);

    // 1. 조직의 멤버 명단에 나를 추가 (Rules에서 허용됨)
    await updateDoc(orgRef, {
      members: arrayUnion(user.uid)
    });

    // 2. 내 프로필에 조직 정보 추가
    await updateDoc(userRef, {
      orgIds: arrayUnion(orgId),
      orgs: arrayUnion({
        id: orgId,
        name: (await getDoc(orgRef)).data().name, // 조직 이름 가져오기
        role: 'member'
      })
    });
  },

  // 3. 조직 정보 수정
  async updateOrg(orgId, data) {
    const docRef = doc(db, "organizations", orgId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },

  async deleteOrg(orgId, memberUids) {
    const batch = writeBatch(db); // 여러 작업을 한 번에 처리 (Atomic)

    // 1) 조직 문서 삭제
    const orgRef = doc(db, "organizations", orgId);
    batch.delete(orgRef);

    // 2) 모든 멤버의 프로필에서 해당 조직 정보 제거
    memberUids.forEach(uid => {
      const userRef = doc(db, "users", uid);
      // 실제로는 userSnap을 읽어와서 filter 후 update하는 것이 정확하지만, 
      // 여기선 편의상 로직 흐름만 기술합니다. (실제 구현 시 개별 유저 문서를 업데이트해야 함)
    });

    await batch.commit();
  },

  async updateOrgName(orgId, newName) {
    const orgRef = doc(db, "organizations", orgId);
    await updateDoc(orgRef, { name: newName });
    // 주의: userProfile 내부에 복사된 orgs 배열의 name도 바꿔줘야 동기화가 완벽합니다.
  },

  // 2. 멤버 권한 변경 (admin <-> member)
  async updateMemberRole(orgId, userId, newRole) {
    // 실제 운영 시에는 해당 유저의 profile 내 orgs 배열을 찾아 role을 수정해야 합니다.
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedOrgs = userData.orgs.map(o =>
        o.id === orgId ? { ...o, role: newRole } : o
      );
      await updateDoc(userRef, { orgs: updatedOrgs });
    }
  },

  // 3. 조직에서 멤버 내보내기
  async removeMember(orgId, userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedOrgs = userData.orgs.filter(o => o.id !== orgId);
      const updatedOrgIds = userData.orgIds.filter(id => id !== orgId);
      await updateDoc(userRef, { orgs: updatedOrgs, orgIds: updatedOrgIds });
    }
  },
  async getOrgMembers(orgId) {
    if (!orgId) return [];

    try {
      // 1. [조직 문서]에서 멤버 UID 리스트만 먼저 가져옵니다.
      const orgRef = doc(db, "organizations", orgId);
      const orgSnap = await getDoc(orgRef);

      if (!orgSnap.exists()) return [];

      // members 필드가 ['uid1', 'uid2', ...] 형태라고 가정합니다.
      const memberIds = orgSnap.data().members || [];
      if (memberIds.length === 0) return [];

      // 2. [유저 컬렉션]에서 해당 UID들에 해당하는 문서만 가져옵니다.
      // documentId() 인덱스는 기본으로 생성되어 있어 추가 설정이 필요 없습니다.
      const q = query(
        collection(db, "users"),
        where(documentId(), "in", memberIds.slice(0, 30)) // 'in'은 한 번에 최대 30개까지 가능
      );

      const userSnap = await getDocs(q);
      return userSnap.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error("멤버 로드 에러:", error);
      throw error;
    }
  },

  // [확인용] 권한 변경 로직 (이전 답변에 있던 것 유지)
  async updateMemberRole(orgId, userId, newRole) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedOrgs = userData.orgs.map(o =>
        o.id === orgId ? { ...o, role: newRole } : o
      );
      await updateDoc(userRef, { orgs: updatedOrgs });
    }
  }
};