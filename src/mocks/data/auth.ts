import type { AuthTokenResponse } from "@/type/user";

export const mockAuthTokenResponse: AuthTokenResponse = {
  userId: 1,
  roleType: "USER",
  accessToken: "mock-access-token-abc123",
  refreshToken: "mock-refresh-token-xyz789",
  tokenType: "Bearer",
};
