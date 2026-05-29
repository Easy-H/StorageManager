export type UserProfile = {
  uid: string;
  email: string | null;
  displayName?: string;
  role?: string;
  name?: string;
  // 필요한 추가 프로필 필드를 여기에 정의하세요.
  [key: string]: any;
};