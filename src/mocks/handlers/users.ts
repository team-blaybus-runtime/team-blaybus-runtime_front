import { http, HttpResponse } from "msw";
import { mockUserInfo, mockMemos, getNextMemoId } from "@/mocks/data/users";

export const usersHandlers = [
  http.get("*/users/me", () => {
    return HttpResponse.json(mockUserInfo);
  }),

  http.put("*/users/profiles", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    Object.assign(mockUserInfo, body);
    return HttpResponse.json(mockUserInfo);
  }),

  http.get("*/users/memos", ({ request }) => {
    const url = new URL(request.url);
    const productType = url.searchParams.get("productType");

    const filtered = productType
      ? mockMemos.filter((m) => m.productTypeDesc === productType)
      : mockMemos;

    return HttpResponse.json(filtered);
  }),

  http.post("*/users/memos", async ({ request }) => {
    const body = (await request.json()) as {
      productType: string;
      title: string;
      content: string;
    };

    const newMemo = {
      memoId: getNextMemoId(),
      title: body.title,
      content: body.content,
      updatedAt: new Date().toISOString(),
      productTypeDesc: body.productType,
    };

    mockMemos.push(newMemo);
    return HttpResponse.json(newMemo, { status: 201 });
  }),

  http.put("*/users/memos/:memoId", async ({ params, request }) => {
    const { memoId } = params;
    const body = (await request.json()) as { title: string; content: string };
    const memo = mockMemos.find((m) => m.memoId === String(memoId));

    if (!memo) {
      return new HttpResponse(null, { status: 404 });
    }

    memo.title = body.title;
    memo.content = body.content;
    memo.updatedAt = new Date().toISOString();

    return HttpResponse.json(memo);
  }),

  http.delete("*/users/memos/:memoId", ({ params }) => {
    const { memoId } = params;
    const index = mockMemos.findIndex((m) => m.memoId === String(memoId));

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockMemos.splice(index, 1);
    return new HttpResponse(null, { status: 200 });
  }),
];
