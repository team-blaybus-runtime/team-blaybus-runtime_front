import type React from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import type { Message } from "@/type/aiChat";

interface MessageListProps {
  messages: Message[];
  showThinking: boolean;
  onScroll: () => void;
  messageAreaRef: React.RefObject<HTMLDivElement | null>;
}

interface MessageItemProps {
  message: Message;
}

export default function MessageList({
  messages,
  showThinking,
  onScroll,
  messageAreaRef,
}: MessageListProps) {
  return (
    <MessageArea ref={messageAreaRef} onScroll={onScroll}>
      {messages.map((msg) =>
        msg.role === "user" ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <AIMessageBubble key={msg.id} message={msg} />
        ),
      )}
      {showThinking && <AIThinking />}
    </MessageArea>
  );
}

function UserMessage({ message }: MessageItemProps) {
  return (
    <UserBubble>
      <Font typo="body_2" color="#d4d4d4" style={{ lineHeight: "1.8" }}>
        {message.content}
      </Font>
    </UserBubble>
  );
}

function AIMessageBubble({ message }: MessageItemProps) {
  return (
    <AIMessage>
      <Font typo="body_2" color="#d4d4d4" style={{ lineHeight: "1.8" }}>
        {message.content}
      </Font>
    </AIMessage>
  );
}

function AIThinking() {
  return (
    <AIMessage>
      <ThinkingRow>
        <Spinner />
        <Font typo="body_2" color="#8a8a8a" style={{ lineHeight: "1.8" }}>
          AI가 답변을 생각하고 있어요...
        </Font>
      </ThinkingRow>
    </AIMessage>
  );
}

const MessageArea = styled(Column)`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  gap: 19px;
  padding-bottom: 40px;
`;

const UserBubble = styled(Row)`
  align-items: center;
  background-color: #171717;
  border-radius: 8px;
  padding: 11px 21px;
  width: 100%;
`;

const AIMessage = styled(Column)`
  padding: 0 24px;
  width: 100%;
`;

const ThinkingRow = styled(Row)`
  align-items: center;
  gap: 8px;
  padding: 0 24px;
`;

const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
