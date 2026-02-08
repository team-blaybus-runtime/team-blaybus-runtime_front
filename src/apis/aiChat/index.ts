import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/utils/authTokens";
import { Api } from "@/apis/baseApi";
import { postRefreshToken } from "@/apis/auth";
import {
  AIChatStreamRequest,
  AIChatHistoryResponse,
  AIChatHistoryQuery,
} from "@/type/aiChat";

export async function postAIChatStream(
  body: AIChatStreamRequest,
  signal?: AbortSignal,
): Promise<Response> {
  const request = (token?: string | null) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });

  const token = getAccessToken();
  const response = await request(token);
  if (response.status !== 401) return response;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return response;

  try {
    const data = await postRefreshToken(refreshToken);
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data?.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return request(data?.accessToken ?? null);
  } catch {
    return response;
  }
}

export async function fetchAIChatHistory(
  historyId: number,
  query?: AIChatHistoryQuery,
): Promise<AIChatHistoryResponse> {
  const { data } = await Api.get<AIChatHistoryResponse>(
    `/ai-chat/${historyId}`,
    { params: query },
  );
  return data;
}
