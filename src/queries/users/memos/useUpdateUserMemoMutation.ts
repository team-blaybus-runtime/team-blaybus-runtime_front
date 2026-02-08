import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserMemo } from "@/apis/users";

interface UpdateUserMemoPayload {
  memoId: number;
  title: string;
  content: string;
}

export const useUpdateUserMemoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUserMemo"],
    mutationFn: ({ memoId, title, content }: UpdateUserMemoPayload) =>
      updateUserMemo(memoId, { title, content }),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUserMemos"] });
    },
  });
};
