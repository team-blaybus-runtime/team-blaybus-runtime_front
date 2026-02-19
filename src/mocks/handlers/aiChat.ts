import { http, HttpResponse } from "msw";
import { getNextAiResponse, mockChatMessages } from "@/mocks/data/aiChat";

export const aiChatHandlers = [
  http.post("*/ai-chat/stream", () => {
    const text = getNextAiResponse();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const tokens = text.split(/(?<=\s)|(?=\n)/);

        for (const token of tokens) {
          const sseData = `data:${JSON.stringify({ content: token, done: false })}\n\n`;
          controller.enqueue(encoder.encode(sseData));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const doneData = `data:${JSON.stringify({ content: "", done: true })}\n\n`;
        controller.enqueue(encoder.encode(doneData));
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }),

  http.get("*/ai-chat/:historyId", ({ request }) => {
    const url = new URL(request.url);
    const order = url.searchParams.get("order") ?? "asc";
    const limit = Number(url.searchParams.get("limit")) || 20;
    const lastId = url.searchParams.get("lastId");

    let messages = [...mockChatMessages];

    if (lastId) {
      const lastIdNum = Number(lastId);
      messages =
        order === "asc"
          ? messages.filter((m) => m.chatMessageId > lastIdNum)
          : messages.filter((m) => m.chatMessageId < lastIdNum);
    }

    if (order === "desc") {
      messages.reverse();
    }

    const sliced = messages.slice(0, limit);

    return HttpResponse.json({
      messages: sliced,
      hasNext: messages.length > limit,
    });
  }),
];
