import type { User } from 'firebase/auth';
import {
	collection, doc,
	getDoc,
	getDocs,
	onSnapshot,
	serverTimestamp,
	Unsubscribe,
	updateDoc,
	writeBatch
} from 'firebase/firestore';
import { db } from '../../../common/api/firebase/firebase';
import { OrgMember, OrgMembership, OrgRole } from '../types';

export const FirebaseOrgRepository = {

	/**
	 * 1. 내 소속 조직 목록 가져오기
	 */
	async getMyOrgs(userId: string): Promise<OrgMembership[]> {
		if (!userId) return [];
		try {
			const snap = await getDocs(collection(db, "users", userId, "organizations"));
			return snap.docs.map(doc => ({ 
				id: doc.id, 
				...doc.data() 
			} as OrgMembership));
		} catch (error) {
			console.error("소속 조직 로드 실패:", error);
			return [];
		}
	},

	/**
	 * 2. 신규 조직 생성
	 */
	async createOrg(name: string, admin: User, adminProfile?: { name?: string }): Promise<{ id: string, name: string }> {
		const batch = writeBatch(db);
		const newOrgRef = doc(collection(db, "organizations"));
		const orgId = newOrgRef.id;

		const userRef = doc(db, "users", admin.uid);
		const userOrgRef = doc(db, "users", admin.uid, "organizations", orgId);
		const memberRef = doc(db, "organizations", orgId, "members", admin.uid);

		const userName = adminProfile?.name || admin.email?.split('@')[0] || 'Unknown';

		try {
			batch.set(userRef, {
				email: admin.email,
				name: userName,
				updatedAt: serverTimestamp()
			}, { merge: true });

			batch.set(newOrgRef, {
				name: name,
				adminEmail: admin.email,
				adminUid: admin.uid,
				isAutoJoin: false,
				isActive: true,
				createdAt: serverTimestamp()
			});

			const userOrgData = {
				name: name,
				level: OrgRole.ADMIN,
				joinedAt: serverTimestamp()
			};

			const memberData: OrgMember = {
				id: admin.uid,
				uid: admin.uid,
				email: admin.email,
				name: userName,
				level: OrgRole.ADMIN,
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
	 * 3. 조직 참여 신청
	 */
	async joinOrg(orgId: string, user: User, userProfile?: { name?: string }): Promise<void> {
		const orgSnap = await getDoc(doc(db, "organizations", orgId));
		if (!orgSnap.exists()) throw new Error("존재하지 않는 조직입니다.");

		const orgData = orgSnap.data();
		const orgName = orgData.name;
		const isAutoJoin = orgData.isAutoJoin === true;
		const userName = userProfile?.name || user.email?.split('@')[0] || 'Unknown';

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
				level: isAutoJoin ? OrgRole.MEMBER : OrgRole.PENDING,
				requestedAt: serverTimestamp()
			};

			batch.set(userOrgRef, commonData);
			batch.set(memberRef, {
				uid: user.uid,
				email: user.email,
				userName: userName,
				...commonData
			});

			await batch.commit();
		} catch (error) {
			console.error("조직 참여 신청 실패:", error);
			throw error;
		}
	},

	/**
	 * 4. 멤버 레벨 승인 및 변경
	 */
	async updateMemberLevel(orgId: string, targetUserId: string, newLevel: number): Promise<void> {
		const batch = writeBatch(db);
		const userOrgRef = doc(db, "users", targetUserId, "organizations", orgId);
		const memberRef = doc(db, "organizations", orgId, "members", targetUserId);

		const updateData = {
			level: newLevel,
			updatedAt: serverTimestamp()
		};

		batch.update(userOrgRef, updateData);
		batch.update(memberRef, updateData);
		await batch.commit();
	},

	/**
	 * 5. 멤버 삭제/내보내기
	 */
	async removeMember(orgId: string, targetUserId: string): Promise<void> {
		const batch = writeBatch(db);
		batch.delete(doc(db, "users", targetUserId, "organizations", orgId));
		batch.delete(doc(db, "organizations", orgId, "members", targetUserId));
		await batch.commit();
	},

	subscribeMembers(orgId: string, callback: (members: OrgMember[]) => void): Unsubscribe | null {
		if (!orgId) return null;
		const membersRef = collection(db, "organizations", orgId, "members");

		return onSnapshot(membersRef, (snap) => {
			const members = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrgMember));
			callback(members);
		}, (error) => {
			console.error("멤버 구독 실패:", error);
		});
	},

	async deleteOrg(orgId: string): Promise<void> {
		const batch = writeBatch(db);
		const orgRef = doc(db, "organizations", orgId);
		batch.update(orgRef, { isActive: false, deletedAt: serverTimestamp() });

		const membersSnap = await getDocs(collection(db, "organizations", orgId, "members"));
		membersSnap.forEach((mDoc) => {
			batch.update(doc(db, "organizations", orgId, "members", mDoc.id), { isActive: false });
			batch.delete(doc(db, "users", mDoc.id, "organizations", orgId));
		});
		await batch.commit();
	},

	async updateOrgSettings(orgId: string, settings: Partial<any>): Promise<void> {
		const orgRef = doc(db, "organizations", orgId);
		await updateDoc(orgRef, settings);
	},

	async updateOrgName(orgId: string, newName: string): Promise<void> {
		const batch = writeBatch(db);
		batch.update(doc(db, "organizations", orgId), { name: newName });

		const membersSnap = await getDocs(collection(db, "organizations", orgId, "members"));
		membersSnap.forEach((mDoc) => {
			batch.update(doc(db, "users", mDoc.id, "organizations", orgId), { name: newName });
		});
		await batch.commit();
	},
};