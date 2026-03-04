export const AuthRepository = {
  // 상태 변화 감시 (Observer 패턴)
  onAuthStateChanged: (callback) => { throw new Error("Not implemented"); },
  // 사용자 상세 정보 가져오기
  getUserProfile: async (uid) => { throw new Error("Not implemented"); },
  // 로그아웃 등 추가 가능
  signOut: async () => { throw new Error("Not implemented"); },
};