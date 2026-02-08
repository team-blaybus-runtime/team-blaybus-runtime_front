type FieldErrors<T> = Partial<Record<keyof T, string>>;

// 유저 프로필 기본 정보
export type UserProfile = {
  nickname: string;
  major: string;
  grade: number;
  goal: string;
};

// 유저 프로필 설정 타입
export type ProfileSetup = UserProfile;

export type ProfileSetupFormValues = Omit<ProfileSetup, "grade"> & {
  grade: string;
};

export type ProfileSetupField = keyof ProfileSetupFormValues;

export type ProfileSetupErrors = Record<ProfileSetupField, string> & {
  submit: string;
};

// 공통 인증 필드
export type Credentials = {
  email: string;
  password: string;
};

export type PasswordConfirmation = {
  confirmPassword: string;
};

// 유저 회원가입 폼/요청 공통
export type RegisterForm = Credentials & PasswordConfirmation;

export type AuthTokenResponse = {
  userId: number;
  roleType: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
};

export type RegisterErrors = Record<keyof RegisterForm, string> & {
  submit: string;
};

export type RegisterField = keyof RegisterForm;

// 일반 로그인
export type SignInRequest = Credentials;

export type SignUpField = keyof RegisterForm;

export type SignUpErrorResponse = {
  code: string;
  reason: string;
  message: string;
  fieldErrors?: FieldErrors<RegisterForm>;
};

// 유저 정보 타입
export type UserInfo = UserProfile & {
  userId: number;
  role?: string;
  roleType?: string;
};

export type SummaryLabel = "이름" | "전공" | "학년" | "목표";
export type SummaryValues = Record<SummaryLabel, string>;
