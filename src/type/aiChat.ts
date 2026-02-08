export type AIChatStreamRequest = {
  content: string;
  productType: string;
  chatHistoryId: number;
};

export type AIChatMessage = {
  chatMessageId: number;
  content: string;
  role: "ANSWER" | "QUESTION";
  createdAt: string;
};

export type AIChatHistoryResponse = {
  messages: AIChatMessage[];
  hasNext: boolean;
};

export type AIChatHistoryQuery = {
  lastId?: number | null;
  order?: "asc" | "desc";
  limit?: number;
};

export type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};
