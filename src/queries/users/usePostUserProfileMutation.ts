import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserProfile } from "@/apis/users";
import type { ProfileSetup } from "@/type/user";

export const usePostUserProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["postUserProfile"],
    mutationFn: (payload: ProfileSetup) => updateUserProfile(payload),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUserInfo"] });
    },
  });
};
