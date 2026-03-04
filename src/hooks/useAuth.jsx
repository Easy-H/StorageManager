import { useState, useEffect } from 'react';
import { FirebaseAuthRepository as AuthAPI } from '../api/FirebaseAuthRepository';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 상태 변화 감시 시작
    const unsub = AuthAPI.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // 2. 구현체 내부의 로직을 통해 프로필 획득
        const profile = await AuthAPI.getUserProfile(currentUser.uid);
        setUserProfile(profile);
        setUser(currentUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  return { user, userProfile, loading };
}