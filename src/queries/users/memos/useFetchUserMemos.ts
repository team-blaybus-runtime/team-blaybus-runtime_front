import { useQuery } from "@tanstack/react-query";

import { fetchUserMemos } from "@/apis/users";

export const useFetchUserMemosQuery = (productType?: string) => {
  return useQuery({
    queryKey: ["fetchUserMemos", productType],
    queryFn: () => fetchUserMemos(productType),
    staleTime: 1000 * 60 * 1, // 1분 캐시
  });
};
