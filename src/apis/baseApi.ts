import axios, { AxiosInstance } from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/utils/authTokens";
import { postRefreshToken } from "@/apis/auth";

const AUTH_SKIP_PATHS = ["/auth/sign-up", "/auth/sign-in", "/auth/refresh"];

const shouldSkipAuth = (url?: string) =>
  AUTH_SKIP_PATHS.some((path) => url?.includes(path));
let refreshPromise: Promise<string | null> | null = null;

const attachAccessToken = (request: any, token: string | null) => {
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
};

const requestRefreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const data = await postRefreshToken(refreshToken);

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data?.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return data?.accessToken ?? null;
  } catch {
    return null;
  }
};

const redirectToLogin = () => {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const ensureAccessToken = async (
  forceRefresh = false,
): Promise<string | null> => {
  if (!forceRefresh) {
    const existingToken = getAccessToken();
    if (existingToken) return existingToken;
  }

  if (!refreshPromise) {
    refreshPromise = requestRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const applyInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (request) => {
      if (shouldSkipAuth(request.url)) {
        return request;
      }

      const token = await ensureAccessToken();
      attachAccessToken(request, token);

      return request;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const status = error?.response?.status;

      if (status === 401 && shouldSkipAuth(originalRequest?.url)) {
        redirectToLogin();
        return Promise.reject(error);
      }

      if (
        status === 401 &&
        !originalRequest?._retry &&
        !shouldSkipAuth(originalRequest?.url)
      ) {
        originalRequest._retry = true;
        const newToken = await ensureAccessToken(true);
        if (newToken) {
          attachAccessToken(originalRequest, newToken);
          return axiosInstance(originalRequest);
        }
        redirectToLogin();
      }

      return Promise.reject(error);
    },
  );
};

export const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
  headers: {
    "Content-Type": "application/json",
  },
});

applyInterceptors(Api);
