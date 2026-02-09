import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateWorkflow,
  type CreateOrUpdateWorkflowRequest,
} from "@/apis/workflow";

interface UpdateWorkflowPayload extends CreateOrUpdateWorkflowRequest {
  workflowId: number;
}

export const useUpdateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateWorkflow"],
    mutationFn: ({ workflowId, title, nodeInfo }: UpdateWorkflowPayload) =>
      updateWorkflow(workflowId, { title, nodeInfo }),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchWorkflows"] });
    },
  });
};
