import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase가 인증 상태 변화를 감지 → 자동 로그인 유지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // 컴포넌트 언마운트 시 구독 해제
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error('Google 로그인에 실패했습니다.');
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw new Error('로그아웃에 실패했습니다.');
    }
  };

  return { user, loading, signIn, logOut };
}
