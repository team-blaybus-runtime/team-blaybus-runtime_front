import { Api } from "@/apis/baseApi";

import type {
  AuthTokenResponse,
  SignInRequest,
  RegisterForm,
} from "@/type/user";

// 회원가입 API
export const postSignUp = async (data: RegisterForm) => {
  const response = await Api.post<AuthTokenResponse>("/auth/sign-up", data);
  return response.data;
};

// 일반 로그인 API
export const postSignIn = async (data: SignInRequest) => {
  const response = await Api.post<AuthTokenResponse>("/auth/sign-in", data);
  return response.data;
};

// 토큰 재발급 API
export const postRefreshToken = async (refreshToken: string) => {
  const response = await Api.post<AuthTokenResponse>("/auth/refresh", {
    refreshToken,
  });
  return response.data;
};
