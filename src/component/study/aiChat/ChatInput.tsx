import type React from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button, Img, TextArea } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";

interface ChatInputProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatInput({
  value,
  disabled,
  onChange,
  onSend,
  onKeyDown,
}: ChatInputProps) {
  return (
    <InputWrapper>
      <StyledTextArea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        onKeyDown={onKeyDown}
        placeholder="여기에 프롬프트를 입력하세요..."
        rows={1}
        disabled={disabled}
      />
      <SendRow>
        <SendButton onClick={onSend} disabled={!value.trim() || disabled}>
          <Img
            src="/icons/study/send.svg"
            alt="send"
            width="20px"
            height="20px"
          />
        </SendButton>
      </SendRow>
    </InputWrapper>
  );
}

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
