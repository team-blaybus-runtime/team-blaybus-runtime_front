import { Api } from "@/apis/baseApi";
import { MemoItem } from "@/type/memo";

import type { UserInfo, ProfileSetup } from "@/type/user";

// 유저 정보 조회 API
export const fetchUserInfo = async () => {
  const response = await Api.get<UserInfo>("/users/me");
  return response.data;
};

// 유저 프로필 수정 API
export const updateUserProfile = async (profile: ProfileSetup) => {
  const response = await Api.put<ProfileSetup>("/users/profiles", profile);
  return response.data;
};

// 메모 조회 API
export const fetchUserMemos = async () => {
  const response = await Api.get<MemoItem[]>("/users/memos");
  return response.data;
};
