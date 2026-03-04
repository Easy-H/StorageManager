import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const FirebaseAuthRepository = {
  onAuthStateChanged(callback) {
    // Firebase의 상태 변화 함수를 그대로 연결하되, 필요한 정보만 정제해서 넘깁니다.
    return onAuthStateChanged(auth, callback);
  },

  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      return null;
    }
  }
};