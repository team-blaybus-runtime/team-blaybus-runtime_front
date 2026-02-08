export interface AIChatStreamRequest {
  content: string;
  productType: string;
  chatHistoryId: number;
}

export interface AIChatMessage {
  chatMessageId: number;
  content: string;
  role: "ANSWER" | "QUESTION";
  createdAt: string;
}

export interface AIChatHistoryResponse {
  messages: AIChatMessage[];
  hasNext: boolean;
}

export interface AIChatHistoryQuery {
  lastId?: number | null;
  order?: "asc" | "desc";
  limit?: number;
}
