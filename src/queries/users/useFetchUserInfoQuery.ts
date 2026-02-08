import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { fetchUserInfo } from "@/apis/users";

export const useFetchUserInfoQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["fetchUserInfo"],
    queryFn: fetchUserInfo,
    enabled,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 1000, // 10분 캐시
    select: (data) => {
      return data;
    },
  });
};
