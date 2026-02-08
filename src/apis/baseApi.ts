import axios, { AxiosInstance } from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/utils/authTokens";
import { postRefreshToken } from "@/apis/auth";

const REFRESH_ENDPOINT = "/auth/refresh";
let refreshPromise: Promise<string | null> | null = null;

const requestRefreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const data = await postRefreshToken(refreshToken);

  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  if (data?.refreshToken) {
    setRefreshToken(data.refreshToken);
  }

  return data?.accessToken ?? null;
};

const ensureAccessToken = async (): Promise<string | null> => {
  const existingToken = getAccessToken();
  if (existingToken) return existingToken;

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
      if (request.url?.includes(REFRESH_ENDPOINT)) {
        return request;
      }

      const token = await ensureAccessToken();

      if (token) {
        // request.headers["Authorization"] = `Bearer ${token}`;
      }

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

      if (
        status === 401 &&
        !originalRequest?._retry &&
        !originalRequest?.url?.includes(REFRESH_ENDPOINT)
      ) {
        originalRequest._retry = true;
        const newToken = await ensureAccessToken();
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
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
