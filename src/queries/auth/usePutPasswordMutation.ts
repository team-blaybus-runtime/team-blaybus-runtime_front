import { useMutation } from "@tanstack/react-query";

import { putPassword } from "@/apis/auth";
import { toast } from "sonner";

interface PutPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const usePutPasswordMutation = () => {
  return useMutation({
    mutationKey: ["putPassword"],
    mutationFn: (payload: PutPasswordPayload) => putPassword(payload),
    onSuccess: () => {
      toast.success("비밀번호가 변경되었습니다.");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
