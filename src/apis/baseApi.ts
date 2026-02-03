import axios, { AxiosInstance } from "axios";

import { C } from "@/constant/index";
import { getCookie } from "@/utils/cookies";

const applyInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (request) => {
      const token = getCookie(C.AUTH_TOKEN_KEY);

      if (token) {
        request.headers["Authorization"] = `Bearer ${token}`;
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
    (error) => {
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
