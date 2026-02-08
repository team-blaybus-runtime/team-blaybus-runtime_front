"use client";

import styled from "styled-components";
import type { KeyboardEvent, RefObject } from "react";
import { Column } from "@/styles/base/BaseComponents";
import MessageList from "@/component/study/aiChat/MessageList";
import ChatInput from "@/component/study/aiChat/ChatInput";
import type { Message } from "@/type/aiChat";

type StudyAIChatState = {
  messages: Message[];
  input: string;
  showThinking: boolean;
  isInputDisabled: boolean;
  messageAreaRef: RefObject<HTMLDivElement | null>;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  handleScroll: () => void;
};

interface StudyAIChatProps {
  chat: StudyAIChatState;
}

export default function StudyAIChat({ chat }: StudyAIChatProps) {
  const {
    messages,
    input,
    showThinking,
    isInputDisabled,
    messageAreaRef,
    setInput,
    handleSend,
    handleKeyDown,
    handleScroll,
  } = chat;
  return (
    <ChatContainer>
      <MessageList
        messages={messages}
        showThinking={showThinking}
        onScroll={handleScroll}
        messageAreaRef={messageAreaRef}
      />
      <ChatInput
        value={input}
        disabled={isInputDisabled}
        onChange={setInput}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    </ChatContainer>
  );
}

const ChatContainer = styled(Column)`
  width: 480px;
  height: 100%;
  flex-shrink: 0;
`;
