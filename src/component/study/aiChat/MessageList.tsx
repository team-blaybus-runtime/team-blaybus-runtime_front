import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <MarkdownBody $variant="user">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </MarkdownBody>
    </UserBubble>
  );
}

function AIMessageBubble({ message }: MessageItemProps) {
  return (
    <AIMessage>
      <MarkdownBody>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </MarkdownBody>
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

const MarkdownBody = styled.div<{ $variant?: "user" | "ai" }>`
  color: #d4d4d4;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;

  p {
    margin: 0;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 20px;
  }

  code {
    font-family: "Pretendard";
    font-size: 13px;
    background: rgba(255, 255, 255, 0.08);
    padding: 2px 4px;
    border-radius: 4px;
  }

  pre {
    margin: 8px 0;
    padding: 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.35);
    overflow-x: auto;
  }
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
