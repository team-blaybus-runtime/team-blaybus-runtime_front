"use client";

import { useState, useCallback } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button, Img, TextArea } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "user",
    content: "이거 확인해 줘",
  },
  {
    id: 2,
    role: "ai",
    content:
      "AI 어시스턴트 답변~~\n대통령은 내란 또는 외환의 죄를 범한 경우를 제외하고는 재직중 형사상의 소추를 받지 아니한다. 국회의원은 국가이익을 우선하여 양심에 따라 직무를 행한다. 모든 국민은 인간다운 생활을 할 권리를 가진다. 국무총리는 국무위원의 해임을 대통령에게 건의할 수 있다.\n\n대통령은 제4항과 제5항의 규정에 의하여 확정된 법률을 지체없이 공포하여야 한다. 제5항에 의하여 법률이 확정된 후 또는 제4항에 의한 확정법률이 정부에 이송된 후 5일 이내에 대통령이 공포하지 아니할 때에는 국회의장이 이를 공포한다.",
  },
];

export default function StudyAIChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    const aiResponse: Message = {
      id: Date.now() + 1,
      role: "ai",
      content: "AI 응답이 여기에 표시됩니다.",
    };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setInput("");
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <ChatContainer>
      <MessageArea>
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserBubble key={msg.id}>
              <Font typo="body_2" color="#d4d4d4" style={{ lineHeight: "1.8" }}>
                {msg.content}
              </Font>
            </UserBubble>
          ) : (
            <AIMessage key={msg.id}>
              <Font typo="body_2" color="#d4d4d4" style={{ lineHeight: "1.8" }}>
                {msg.content}
              </Font>
            </AIMessage>
          )
        )}
      </MessageArea>
      <InputWrapper>
        <StyledTextArea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="여기에 프롬프트를 입력하세요..."
          rows={1}
        />
        <SendRow>
          <SendButton onClick={handleSend} disabled={!input.trim()}>
            <Img
              src="/icons/study/send.svg"
              alt="send"
              width="20px"
              height="20px"
            />
          </SendButton>
        </SendRow>
      </InputWrapper>
    </ChatContainer>
  );
}

const ChatContainer = styled(Column)`
  width: 480px;
  height: 100%;
  flex-shrink: 0;
`;

const MessageArea = styled(Column)`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  gap: 19px;
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

const InputWrapper = styled(Column)`
  background-color: #2b2b2b;
  border-radius: 16px;
  padding: 12px;
  gap: 2px;
  align-items: flex-end;
  flex-shrink: 0;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
  height: 40px;
  background: transparent;
  resize: none;
  color: #d4d4d4;
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  overflow-y: auto;

  &::placeholder {
    color: #5f5f5f;
  }
`;

const SendRow = styled(Row)`
  justify-content: flex-end;
  width: 100%;
`;

const SendButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${colors.blue_700};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
