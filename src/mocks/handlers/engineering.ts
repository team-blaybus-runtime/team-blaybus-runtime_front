import { http, HttpResponse } from "msw";
import { mockProductTypes, mockParts } from "@/mocks/data/engineering";

export const engineeringHandlers = [
  http.get("*/engineering/parts", ({ request }) => {
    const url = new URL(request.url);
    const productTypeDesc = url.searchParams.get("productTypeDesc") ?? "";
    const parts = mockParts[productTypeDesc] ?? [];
    return HttpResponse.json(parts);
  }),

  http.get("*/engineering", () => {
    return HttpResponse.json(mockProductTypes);
  }),
];
