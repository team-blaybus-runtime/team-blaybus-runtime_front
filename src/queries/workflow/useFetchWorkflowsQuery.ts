import { useQuery } from "@tanstack/react-query";

import { fetchWorkflows } from "@/apis/workflow";

export const useFetchWorkflowsQuery = () => {
  return useQuery({
    queryKey: ["fetchWorkflows"],
    queryFn: fetchWorkflows,
    staleTime: 1000 * 60 * 1, // 1분 캐시
  });
};
