import { Api } from "@/apis/baseApi";

import type { UserInfo } from "@/type/user";

// 유저 정보 조회 API
export const fetchUserInfo = async () => {
  const response = await Api.get<UserInfo>("/users");
  return response.data;
};
