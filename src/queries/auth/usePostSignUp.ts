import { useMutation } from "@tanstack/react-query";

import { postSignUp } from "@/apis/auth";
import { SignUpRequest } from "@/type/user";

export const usePostSignUpMutation = () => {
  return useMutation({
    mutationKey: ["postSignUp"],
    mutationFn: (payload: SignUpRequest) => postSignUp(payload),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
};
