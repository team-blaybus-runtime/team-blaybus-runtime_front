import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteWorkflow } from "@/apis/workflow";

interface DeleteWorkflowPayload {
  workflowId: number;
}

export const useDeleteWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteWorkflow"],
    mutationFn: ({ workflowId }: DeleteWorkflowPayload) =>
      deleteWorkflow(workflowId),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchWorkflows"] });
    },
  });
};
