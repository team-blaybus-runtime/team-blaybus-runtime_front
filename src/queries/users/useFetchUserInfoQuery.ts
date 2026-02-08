import { useQuery } from "@tanstack/react-query";

import { fetchUserInfo } from "@/apis/users";

export const useFetchUserInfoQuery = () => {
  return useQuery({
    queryKey: ["fetchUserInfo"],
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 1000, // 10분 캐시
  });
};
