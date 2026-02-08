import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUserMemo } from "@/apis/users";

interface CreateUserMemoPayload {
  productType: string;
  title: string;
  content: string;
}

export const useCreateUserMemoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUserMemo"],
    mutationFn: (payload: CreateUserMemoPayload) => createUserMemo(payload),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUserMemos"] });
    },
  });
};
