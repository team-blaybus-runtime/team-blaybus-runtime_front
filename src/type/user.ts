// 유저 프로필 설정 타입
export type ProfileSetupValues = {
  name: string;
  major: string;
  grade: string;
  goal: string;
};

// 유저 회원가입
export type SignUpRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthTokenResponse = {
  userId: number;
  roleType: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
};

export type RegisterValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterErrors = {
  email: string;
  password: string;
  confirmPassword: string;
  submit: string;
};

export type RegisterField = keyof RegisterValues;

// 일반 로그인
export type SignInRequest = Pick<SignUpRequest, "email" | "password">;

export type SignUpField = keyof SignUpRequest;

export type SignUpErrorResponse = {
  code: string;
  reason: string;
  message: string;
  fieldErrors?: Partial<Record<SignUpField, string>>;
};

// 유저 정보 타입
export type UserInfo = {
  userId: number;
  nickname: string;
  username: string;
  password: string;
  major: string;
  grade: number;
  goal: string;
  role: string;
};
