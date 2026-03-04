import { db } from './firebase';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, where, documentId,
  getDocs, query, orderBy, serverTimestamp, getDoc, arrayUnion, writeBatch
} from 'firebase/firestore';

export const FirebaseOrgRepository = {

  // 1. 모든 조직 목록 가져오기 (가나다순)
  // 1. 내가 소속된(또는 신청한) 조직 목록만 가져오기
  async getAllOrgs(userProfile) {
    // 유저 프로필이 없거나 참여 중인 조직 ID 리스트가 없으면 빈 배열 반환
    if (!userProfile || !userProfile.orgIds || userProfile.orgIds.length === 0) {
      return [];
    }

    try {
      // 내 orgIds 배열에 포함된 문서만 가져오는 쿼리
      // 'in' 연산자는 최대 30개까지 지원합니다.
      const q = query(
        collection(db, "organizations"),
        where(documentId(), "in", userProfile.orgIds.slice(0, 30))
      );

      const snap = await getDocs(q);

      // 불러온 조직 데이터와 내 프로필에 저장된 role 정보를 결합하여 반환
      return snap.docs.map(doc => {
        const orgData = doc.data();
        // 내 프로필의 orgs 배열에서 해당 조직의 내 역할을 찾음
        const myRelation = userProfile.orgs?.find(o => o.id === doc.id);

        return {
          id: doc.id,
          ...orgData,
          myRole: myRelation?.role || 'member' // 내 역할 정보 추가
        };
      });
    } catch (error) {
      console.error("소속 조직 로드 실패:", error);
      return [];
    }
  },

  // 2. 신규 조직 생성
  async createOrg(name, adminEmail, uerProfile) {
    const newOrgRef = doc(collection(db, "organizations"));
    const orgId = newOrgRef.id;
    const userRef = doc(db, "users", uerProfile.uid);

    try {
      // 1) 조직 기본 문서 생성
      await setDoc(newOrgRef, {
        name,
        adminEmail,
        uid: uerProfile.uid,
        createdAt: serverTimestamp(),
        isActive: true,
      });

      // 2) [관계 객체] members 서브 컬렉션에 관리자 등록
      const memberRef = doc(db, "organizations", orgId, "members", uerProfile.uid);
      await setDoc(memberRef, {
        uid: uerProfile.uid,
        email: adminEmail,
        role: 'admin',
        status: 'approved', // 생성자는 즉시 승인
        joinedAt: serverTimestamp()
      });

      // 3) 유저 문서 업데이트 (내가 속한 조직 목록에 추가)
      const newOrgInfo = { id: orgId, name: name, role: 'admin' };
      await setDoc(userRef, {
        orgs: arrayUnion(newOrgInfo),
        orgIds: arrayUnion(orgId),
        updatedAt: serverTimestamp()
      }, { merge: true });

      return { id: orgId, name };
    } catch (error) {
      console.error("조직 생성 실패:", error);
      throw error;
    }
  },

  // 3. 조직 참여 신청 (이메일 및 유저 정보 포함)
  async joinOrg(orgId, userEmail, userProfile) {
    const orgRef = doc(db, "organizations", orgId);
    const memberRef = doc(db, "organizations", orgId, "members", userProfile.uid);
    const userRef = doc(db, "users", userProfile.uid);

    try {
      // 조직 존재 및 이름 확인
      const orgSnap = await getDoc(orgRef);
      if (!orgSnap.exists()) throw new Error("존재하지 않는 조직 코드입니다.");
      const orgName = orgSnap.data().name;

      // 1) [관계 객체] members 서브 컬렉션에 신청 정보 생성
      await setDoc(memberRef, {
        uid: userProfile.uid,
        email: userEmail,
        name: userProfile?.name || userEmail.split('@')[0],
        role: 'member',
        status: 'pending', // 기본값은 대기 상태
        requestedAt: serverTimestamp()
      });

      // 2) 유저 문서 업데이트 (신청한 조직 ID 기록)
      const newOrgInfo = { id: orgId, name: orgName, role: 'member' };
      await setDoc(userRef, {
        orgs: arrayUnion(newOrgInfo),
        orgIds: arrayUnion(orgId),
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      console.error("조직 참여 신청 실패:", error);
      throw error;
    }
  },
  // FirebaseOrgRepository.js 수정 버전 (정렬 제거)
  async getOrgMembers(orgId) {
    if (!orgId) return [];
    try {
      const membersRef = collection(db, "organizations", orgId, "members");

      // ✨ 정렬(orderBy)을 제거하여 인덱스 에러 위험을 없앰
      const querySnapshot = await getDocs(membersRef);

      const members = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // ✨ 필요하다면 클라이언트에서 정렬 (선택 사항)
      // 예: 관리자(admin)를 위로, 그다음 이름순으로
      return members.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return (a.name || '').localeCompare(b.name || '');
      });

    } catch (error) {
      console.error("멤버 로드 에러:", error);
      throw error;
    }
  },

  // 5. 멤버 승인 처리 (pending -> approved)
  async approveMember(orgId, userId) {
    const memberRef = doc(db, "organizations", orgId, "members", userId);
    try {
      await updateDoc(memberRef, {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("멤버 승인 실패:", error);
      throw error;
    }
  },

  // 6. 멤버 권한 변경 (admin <-> member)
  async updateMemberRole(orgId, userId, newRole) {
    try {
      // 1) 관계 객체(members) 수정
      const memberRef = doc(db, "organizations", orgId, "members", userId);
      await updateDoc(memberRef, { role: newRole });

      // 2) 유저 프로필 내 복사된 정보도 수정 (Denormalization 데이터 동기화)
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedOrgs = userData.orgs.map(o =>
          o.id === orgId ? { ...o, role: newRole } : o
        );
        await updateDoc(userRef, { orgs: updatedOrgs });
      }
    } catch (error) {
      console.error("권한 변경 실패:", error);
      throw error;
    }
  },

  // 7. 조직에서 멤버 내보내기 (또는 탈퇴)
  async removeMember(orgId, userId) {
    try {
      // 1) 관계 객체(members) 삭제
      const memberRef = doc(db, "organizations", orgId, "members", userId);
      await deleteDoc(memberRef);

      // 2) 유저 프로필에서 해당 조직 정보 제거
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedOrgs = userData.orgs.filter(o => o.id !== orgId);
        const updatedOrgIds = userData.orgIds.filter(id => id !== orgId);
        await updateDoc(userRef, { orgs: updatedOrgs, orgIds: updatedOrgIds });
      }
    } catch (error) {
      console.error("멤버 삭제 실패:", error);
      throw error;
    }
  },

  // 8. 조직 정보 수정 (이름 등)
  async updateOrg(orgId, data) {
    const docRef = doc(db, "organizations", orgId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },

  // 9. 조직 삭제
  async deleteOrg(orgId) {
    // 주의: 실제 구현 시에는 하위 members, products 컬렉션도 모두 지워야 완벽합니다.
    // 여기서는 조직 기본 문서만 삭제하는 로직입니다.
    const orgRef = doc(db, "organizations", orgId);
    await deleteDoc(orgRef);
  }
};