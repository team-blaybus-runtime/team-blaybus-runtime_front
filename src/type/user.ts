// 유저 프로필 설정 타입
export type ProfileSetupValues = {
  name: string;
  major: string;
  grade: string;
  goal: string;
};

// 유저 회원가입
export type SignUpRequest = {
  username: string;
  password: string;
  confirmPassword: string;
};

export type SignUpResponse = {
  id?: string;
  username?: string;
  nickname?: string;
};

// 회원가입 폼 상태
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

export type RegisterErrorField = "email" | "password" | "confirmPassword";
