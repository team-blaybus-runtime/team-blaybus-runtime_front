import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { postSignUp } from "@/apis/auth";
import { C } from "@/constant";
import { setAccessToken, setRefreshToken } from "@/utils/authTokens";
import type { AuthTokenResponse, SignUpErrorResponse, RegisterForm } from "@/type/user";

interface UsePostSignUpOptions {
  onError?: (error: AxiosError<SignUpErrorResponse>) => void;
}

export const usePostSignUpMutation = (options?: UsePostSignUpOptions) => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["postSignUp"],
    mutationFn: (payload: RegisterForm) => postSignUp(payload),
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
      try {
        sessionStorage.setItem(C.SHOW_PROFILE_SETUP_KEY, "1");
      } catch {}
      router.push("/main");
    },
  });
};
