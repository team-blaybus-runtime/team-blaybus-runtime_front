import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUserMemo } from "@/apis/users";

interface DeleteUserMemoPayload {
  memoId: number;
}

export const useDeleteUserMemoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUserMemo"],
    mutationFn: ({ memoId }: DeleteUserMemoPayload) => deleteUserMemo(memoId),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUserMemos"] });
    },
  });
};
