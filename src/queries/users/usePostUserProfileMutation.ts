import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserProfile } from "@/apis/users";
import type { ProfileSetup } from "@/type/user";
import { toast } from "sonner";

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
      toast.success("프로필이 수정되었습니다.");
    },
  });
};
