"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import MessageList from "@/component/study/aiChat/MessageList";
import ChatInput from "@/component/study/aiChat/ChatInput";
import useStudyAIChat from "@/component/study/aiChat/useStudyAIChat";

interface StudyAIChatProps {
  productType?: string;
  chatHistoryId?: number;
}

export default function StudyAIChat({
  productType = "Drone",
  chatHistoryId = 1,
}: StudyAIChatProps) {
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
  } = useStudyAIChat({ productType, chatHistoryId });

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
