import { C } from "@/constant";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";

const TOKEN_COOKIE_OPTIONS = { path: "/", sameSite: "lax" as const };

export const getAccessToken = () => getCookie(C.AUTH_TOKEN_KEY);

export const setAccessToken = (token: string) => {
  setCookie(C.AUTH_TOKEN_KEY, token, TOKEN_COOKIE_OPTIONS);
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(C.REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(C.REFRESH_TOKEN_KEY, token);
};

export const clearTokens = () => {
  removeCookie(C.AUTH_TOKEN_KEY, "", "/");
  if (typeof window === "undefined") return;
  localStorage.removeItem(C.REFRESH_TOKEN_KEY);
};
