import { useQuery } from "@tanstack/react-query";

import { fetchUserMemos } from "@/apis/users";

export const useFetchUserMemosQuery = () => {
  return useQuery({
    queryKey: ["fetchUserMemos"],
    queryFn: fetchUserMemos,
    staleTime: 1000 * 60 * 1000, // 10분 캐시
  });
};
