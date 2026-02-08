import { useState, useCallback, useRef, useEffect } from "react";
import { postAIChatStream, fetchAIChatHistory } from "@/apis/aiChat";
import type { Message } from "@/type/aiChat";

interface UseStudyAIChatParams {
  productType: string;
  chatHistoryId: number;
}

export default function useStudyAIChat({
  productType,
  chatHistoryId,
}: UseStudyAIChatParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const streamAbortRef = useRef<AbortController | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  const initialLoadRef = useRef(false);
  const typingQueueRef = useRef("");
  const typingTimerRef = useRef<number | null>(null);
  const autoScrollRef = useRef(true);

  const lastMessage = messages[messages.length - 1];
  const showThinking =
    isStreaming && lastMessage?.role === "ai" && !lastMessage?.content;
  const isInputDisabled = isStreaming || isTyping;

  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
  }, []);

  const startTyping = useCallback(
    (targetId: number) => {
      if (typingTimerRef.current) return;
      setIsTyping(true);
      typingTimerRef.current = window.setInterval(() => {
        if (!typingQueueRef.current) {
          stopTyping();
          return;
        }
        const nextChunk = typingQueueRef.current.slice(0, 2);
        typingQueueRef.current = typingQueueRef.current.slice(2);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === targetId
              ? { ...msg, content: msg.content + nextChunk }
              : msg,
          ),
        );
      }, 30);
    },
    [stopTyping],
  );

  const isNearBottom = useCallback((el: HTMLDivElement) => {
    const threshold = 60;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= threshold;
  }, []);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const data = await fetchAIChatHistory(chatHistoryId, {
          lastId: null,
          order: "asc",
          limit: 50,
        });

        if (!active) return;
        const mapped: Message[] = data.messages.map((msg) => ({
          id: msg.chatMessageId,
          role: msg.role === "ANSWER" ? "ai" : "user",
          content: msg.content,
        }));
        setMessages(mapped);
        setHasNext(data.hasNext);
        initialLoadRef.current = true;
        requestAnimationFrame(() => {
          const el = messageAreaRef.current;
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        });
      } catch {
        // 히스토리 조회 실패 시 기존 메시지 유지
      }
    };

    loadHistory();

    return () => {
      active = false;
      stopTyping();
    };
  }, [chatHistoryId, stopTyping]);

  useEffect(() => {
    const el = messageAreaRef.current;
    if (!el || !autoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, showThinking, isTyping, isStreaming]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    streamAbortRef.current?.abort();
    stopTyping();
    typingQueueRef.current = "";

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    const aiResponse: Message = {
      id: Date.now() + 1,
      role: "ai",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setInput("");

    const controller = new AbortController();
    streamAbortRef.current = controller;
    setIsStreaming(true);

    try {
      const response = await postAIChatStream(
        {
          content: userMessage.content,
          productType,
          chatHistoryId,
        },
        controller.signal,
      );

      if (!response.ok || !response.body) {
        throw new Error("스트리밍 응답을 시작하지 못했습니다.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const appendAnswer = (chunk: string) => {
        if (!chunk) return;
        typingQueueRef.current += chunk;
        startTyping(aiResponse.id);
      };

      const handleEvent = (eventChunk: string) => {
        const dataLines = eventChunk
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace(/^data:\s?/, ""));

        if (dataLines.length === 0) return;
        const data = dataLines.join("\n").trim();
        if (!data || data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            const answer = parsed
              .map((item) => item?.answer)
              .filter(Boolean)
              .join("");
            appendAnswer(answer || data);
            return;
          }
          if (parsed?.answer) {
            appendAnswer(parsed.answer);
            return;
          }
        } catch {
          // JSON이 아니면 원문 그대로 사용
        }

        appendAnswer(data);
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        events.forEach(handleEvent);
      }

      if (buffer.trim()) {
        handleEvent(buffer);
      }
    } catch {
      stopTyping();
      typingQueueRef.current = "";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiResponse.id
            ? { ...msg, content: "응답을 가져오지 못했습니다." }
            : msg,
        ),
      );
      if (typingQueueRef.current) {
        startTyping(aiResponse.id);
      }
    } finally {
      setIsStreaming(false);
    }
  }, [chatHistoryId, input, isStreaming, productType, startTyping, stopTyping]);

  const loadMoreHistory = useCallback(async () => {
    if (isLoadingHistory || !hasNext || messages.length === 0) return;
    setIsLoadingHistory(true);

    const el = messageAreaRef.current;
    const prevScrollHeight = el?.scrollHeight ?? 0;
    const prevScrollTop = el?.scrollTop ?? 0;
    const lastId = messages[0]?.id;

    try {
      const data = await fetchAIChatHistory(chatHistoryId, {
        order: "desc",
        limit: 20,
        lastId,
      });
      const mapped: Message[] = data.messages.map((msg) => ({
        id: msg.chatMessageId,
        role: msg.role === "ANSWER" ? "ai" : "user",
        content: msg.content,
      }));
      const nextMessages = mapped.reverse();
      setMessages((prev) => [...nextMessages, ...prev]);
      setHasNext(data.hasNext);
      requestAnimationFrame(() => {
        const nextEl = messageAreaRef.current;
        if (!nextEl) return;
        const nextScrollHeight = nextEl.scrollHeight;
        nextEl.scrollTop = nextScrollHeight - prevScrollHeight + prevScrollTop;
      });
    } catch {
      // 추가 히스토리 조회 실패 시 무시
    } finally {
      setIsLoadingHistory(false);
    }
  }, [chatHistoryId, hasNext, isLoadingHistory, messages]);

  const handleScroll = useCallback(() => {
    const el = messageAreaRef.current;
    if (!el || !initialLoadRef.current) return;
    autoScrollRef.current = isNearBottom(el);
    if (el.scrollTop <= 24) {
      loadMoreHistory();
    }
  }, [isNearBottom, loadMoreHistory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return {
    messages,
    input,
    showThinking,
    isInputDisabled,
    messageAreaRef,
    setInput,
    handleSend,
    handleKeyDown,
    handleScroll,
  };
}
