import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { postSignIn } from "@/apis/auth";
import { setAccessToken, setRefreshToken } from "@/utils/authTokens";
import type { SignInRequest, SignUpErrorResponse } from "@/type/user";

interface UsePostSignInOptions {
  onError?: (error: AxiosError<SignUpErrorResponse>) => void;
}

export const usePostSignInMutation = (options?: UsePostSignInOptions) => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["postSignIn"],
    mutationFn: (payload: SignInRequest) => postSignIn(payload),
    onError: (error) => {
      options?.onError?.(error as AxiosError<SignUpErrorResponse>);
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      if (data?.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      router.push("/main");
    },
  });
};
