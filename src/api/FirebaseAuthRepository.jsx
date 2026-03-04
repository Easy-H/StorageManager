import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // ✨ signOut 추가
import { doc, getDoc } from 'firebase/firestore';

export const FirebaseAuthRepository = {
  // [R] 인증 상태 변경 감시
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // [R] 유저 프로필(Firestore) 정보 가져오기
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      return null;
    }
  },
  async signIn(email, password) {
    console.log(email);
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async signUp(email, password) {
    console.log(email);
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    await signOut(auth);
  }
};