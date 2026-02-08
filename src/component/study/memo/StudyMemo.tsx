"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Column, Grid, Row } from "@/styles/base/BaseComponents";
import { Button, Img, Input, TextArea } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import MemoCardItem from "./MemoCardItem";
import MemoDetailModal from "./MemoDetailModal";
import type { MemoItem } from "@/type/memo";
import { useCreateUserMemoMutation } from "@/queries/users/memos/useCreateUserMemoMutation";

interface StudyMemoProps {
  memos: MemoItem[];
  productType: string;
}

export default function StudyMemo({ memos, productType }: StudyMemoProps) {
  const [activeMemoId, setActiveMemoId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const { mutate: createMemo, isPending } = useCreateUserMemoMutation();

  const handleMemoOpen = useCallback((id: string) => {
    setActiveMemoId(id);
  }, []);

  const handleMemoClose = useCallback(() => {
    setActiveMemoId(null);
    setIsEditingMemo(false);
  }, []);

  const activeMemo = memos.find((memo) => memo.memoId === activeMemoId) ?? null;
  const isSendDisabled = !title.trim() || !content.trim() || isPending;

  const handleSend = useCallback(() => {
    if (isSendDisabled) return;

    createMemo(
      {
        productType,
        title: title.trim(),
        content: content.trim(),
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
        },
      },
    );
  }, [content, isSendDisabled, productType, title]);

  return (
    <ChatContainer>
      <Font typo="title_3" color="neutral_0" py="6px">
        MEMO
      </Font>
      <MemoAreaWrapper>
        <MemoArea>
          {memos.map((memo) => (
            <MemoCardItem
              key={memo.memoId}
              memo={memo}
              onOpen={() => handleMemoOpen(memo.memoId)}
            />
          ))}
        </MemoArea>
        {activeMemo && (
          <MemoDetailModal
            memo={activeMemo}
            onClose={handleMemoClose}
            onEditingChange={setIsEditingMemo}
          />
        )}
      </MemoAreaWrapper>
      {!isEditingMemo && (
        <InputWrapper>
          <TitleInput
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력하세요..."
          />
          <StyledTextArea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={() => {}}
            placeholder="내용을 입력하세요..."
            rows={3}
          />
          <SendRow>
            <SendButton onClick={handleSend} disabled={isSendDisabled}>
              <Img
                src="/icons/study/memoSend.svg"
                alt="send"
                width="20px"
                height="20px"
              />
            </SendButton>
          </SendRow>
        </InputWrapper>
      )}
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
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const TitleInput = styled(Input)`
  width: 100%;
  height: 36px;
  background: transparent;
  color: #d4d4d4;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  line-height: 1.4;
  padding: 4px 0;

  &::placeholder {
    color: #5f5f5f;
  }
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
  min-height: 72px;
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
