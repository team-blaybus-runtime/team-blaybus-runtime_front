import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getAccessToken } from "@/utils/authTokens";
import { useFetchUserInfoQuery } from "@/queries/users/useFetchUserInfoQuery";
import { UserInfo } from "@/type/user";

interface UseAuthPageRedirectResult {
  userInfo: UserInfo | undefined;
}

export const useAuthPageRedirect = (
  isAuthPage: boolean,
  redirectPath = "/main",
): UseAuthPageRedirectResult => {
  const router = useRouter();
  const accessToken = getAccessToken();
  const shouldFetchUserInfo = !isAuthPage || Boolean(accessToken);
  const { data: userInfo } = useFetchUserInfoQuery(shouldFetchUserInfo);

  useEffect(() => {
    if (isAuthPage && userInfo) {
      router.replace(redirectPath);
    }
  }, [isAuthPage, redirectPath, router, userInfo]);

  return { userInfo };
};
