import { http, HttpResponse } from "msw";
import { mockStudyHistories, getNextStudyId } from "@/mocks/data/study";
import type { CreateStudyHistoryRequest } from "@/apis/study";

export const studyHandlers = [
  http.get("*/user-study-histories", () => {
    return HttpResponse.json(mockStudyHistories);
  }),

  http.post("*/user-study-histories", async ({ request }) => {
    const body = (await request.json()) as CreateStudyHistoryRequest;

    const existing = mockStudyHistories.find(
      (h) => h.title === body.title && h.ProductTypeDesc === body.productTypeDesc,
    );

    if (existing) {
      existing.viewInfo = body.viewInfo;
      existing.updatedAt = new Date().toISOString();
      return HttpResponse.json(existing);
    }

    const newHistory = {
      userStudyHisId: getNextStudyId(),
      title: body.title,
      updatedAt: new Date().toISOString(),
      ProductTypeDesc: body.productTypeDesc,
      productImageUrl: "",
      viewInfo: body.viewInfo,
    };

    mockStudyHistories.push(newHistory);
    return HttpResponse.json(newHistory, { status: 201 });
  }),
];
