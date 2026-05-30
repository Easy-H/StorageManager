import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { FirebaseAuthRepository as AuthAPI } from '../api/FirebaseAuthRepository';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. 상태 변화 감시 시작
    const unsub = AuthAPI.onAuthStateChanged(async (currentUser: User | null) => {
      if (currentUser) {
        // 2. 구현체 내부의 로직을 통해 프로필 획득
        const profile = await AuthAPI.getUserProfile(currentUser.uid);
        setUserProfile(profile as UserProfile);
        setUser(currentUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const signUp = (email: string, pass: string) => AuthAPI.signUp(email, pass);
  const signIn = (email: string, pass: string) => AuthAPI.signIn(email, pass);

  return { user, userProfile, loading, signUp, signIn };
}