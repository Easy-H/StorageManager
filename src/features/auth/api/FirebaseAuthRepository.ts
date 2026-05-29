import { auth, db } from '../../../common/api/firebase/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  Unsubscribe
} from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';

export const FirebaseAuthRepository = {
  // [R] 인증 상태 변경 감시
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  },

  // [R] 유저 프로필(Firestore) 정보 가져오기
  async getUserProfile(uid: string): Promise<DocumentData | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async signUp(email: string, password: string): Promise<UserCredential> {
    console.log(email);
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  }
};