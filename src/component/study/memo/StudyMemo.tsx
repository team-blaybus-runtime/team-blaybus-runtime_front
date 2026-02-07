"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Column, Grid, Row } from "@/styles/base/BaseComponents";
import { Button, Img, TextArea } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import MemoCardItem from "./MemoCardItem";
import MemoDetailModal from "./MemoDetailModal";
import type { StudyMemo } from "@/type/memo";

const INITIAL_MEMOS: StudyMemo[] = [
  {
    id: 1,
    title: "어떤 부품에 대한 생각",
    content: "내 생각은 이래 이래생각 생각",
    updatedAt: "2026-02-07",
  },
  {
    id: 2,
    title: "이거 확인해 줘",
    content: "이거 확인해 줘",
    updatedAt: "2026-02-07",
  },
];

export default function StudyMemo() {
  const [memos, setMemos] = useState<StudyMemo[]>(INITIAL_MEMOS);
  const [input, setInput] = useState("");
  const [activeMemoId, setActiveMemoId] = useState<number | null>(null);

  const handleMemoOpen = useCallback((id: number) => {
    setActiveMemoId(id);
  }, []);

  const handleMemoClose = useCallback(() => {
    setActiveMemoId(null);
  }, []);

  const activeMemo = memos.find((memo) => memo.id === activeMemoId) ?? null;

  return (
    <ChatContainer>
      <Font typo="title_3" color="neutral_0" py="6px">
        MEMO
      </Font>
      <MemoAreaWrapper>
        <MemoArea>
          {memos.map((memo) => (
            <MemoCardItem key={memo.id} memo={memo} onOpen={handleMemoOpen} />
          ))}
        </MemoArea>
        {activeMemo && (
          <MemoDetailModal memo={activeMemo} onClose={handleMemoClose} />
        )}
      </MemoAreaWrapper>
      <InputWrapper>
        <StyledTextArea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={() => {}}
          placeholder="여기에 메모를 입력하세요..."
          rows={1}
        />
        <SendRow>
          <SendButton onClick={() => {}} disabled={!input.trim()}>
            <Img
              src="/icons/study/memoSend.svg"
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
  grid-gap: 24px;
`;

const MemoAreaWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const MemoArea = styled(Grid)`
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  align-content: start;
  grid-auto-rows: max-content;
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
