import { Api } from "@/apis/baseApi";

import { APIResponse } from "@/type/response";
import { SignUpRequest, SignUpResponse } from "@/type/user";

// 회원가입 API
export const postSignUp = async (
  data: SignUpRequest,
): Promise<APIResponse<SignUpResponse>> => {
  const response = await Api.post<APIResponse<SignUpResponse>>(
    "/auth/sign-up",
    data,
  );
  return response.data;
};
