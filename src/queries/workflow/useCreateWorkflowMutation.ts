import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createWorkflow,
  type CreateOrUpdateWorkflowRequest,
} from "@/apis/workflow";

export const useCreateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createWorkflow"],
    mutationFn: (payload: CreateOrUpdateWorkflowRequest) =>
      createWorkflow(payload),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchWorkflows"] });
    },
  });
};
