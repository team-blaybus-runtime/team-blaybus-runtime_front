import { http, HttpResponse } from "msw";
import { mockAuthTokenResponse } from "@/mocks/data/auth";

export const authHandlers = [
  http.post("*/auth/sign-up", () => {
    return HttpResponse.json(mockAuthTokenResponse);
  }),

  http.post("*/auth/sign-in", () => {
    return HttpResponse.json(mockAuthTokenResponse);
  }),

  http.post("*/auth/refresh", () => {
    return HttpResponse.json(mockAuthTokenResponse);
  }),

  http.put("*/auth/password", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete("*/users", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
