import { Cookies } from "react-cookie";

const cookies = new Cookies();

type CookieSetOptions = Parameters<Cookies["set"]>[2];

// 쿠키값 가져오기
export const getCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;
  return cookies.get(name);
};

// 쿠키를 설정
export const setCookie = (
  name: string,
  value: string,
  options?: CookieSetOptions
) => {
  return cookies.set(name, value, { ...options });
};

// 쿠키 삭제
export const removeCookie = (name: string, domain: string, path: string) => {
  return cookies.remove(name, { domain: domain, path: path });
};
