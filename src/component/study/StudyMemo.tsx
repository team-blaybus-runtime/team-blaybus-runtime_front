"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Column, Grid, Row } from "@/styles/base/BaseComponents";
import { Button, Img, TextArea } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";

interface Memo {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

const INITIAL_MEMOS: Memo[] = [
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
  const [memos, setMemos] = useState<Memo[]>(INITIAL_MEMOS);
  const [input, setInput] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleMenuToggle = useCallback((id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenuId(null);
  }, []);

  return (
    <ChatContainer>
      <Font typo="title_3" color="neutral_0" py="6px">
        MEMO
      </Font>
      <MemoArea>
        {memos.map((memo) => (
          <Column
            key={memo.id}
            bg="alpha_light_10"
            width="100%"
            height="auto"
            borderRadius="12px"
            p="14.5px 17px"
            minHeight="240px"
          >
            <Column width="100%" gridGap="15px" flex="1">
              <Font typo="title_3" color="neutral_0">
                {memo.title}
              </Font>
              <Font typo="caption_s" color="neutral_300">
                {memo.content}
              </Font>
            </Column>
            <Row
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Font typo="caption_s" color="neutral_500">
                {memo.updatedAt}
              </Font>
              <MenuWrapper>
                <MenuButton
                  type="button"
                  onClick={() => handleMenuToggle(memo.id)}
                >
                  <Img
                    src="/icons/common/verticalDot.svg"
                    alt="edit"
                    width="24px"
                    height="24px"
                  />
                </MenuButton>
                {openMenuId === memo.id && (
                  <MenuDropdown>
                    <MenuItem onClick={handleMenuClose}>수정</MenuItem>
                    <MenuItem onClick={handleMenuClose}>삭제</MenuItem>
                  </MenuDropdown>
                )}
              </MenuWrapper>
            </Row>
          </Column>
        ))}
      </MemoArea>
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

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const MenuDropdown = styled(Column)`
  width: 100%;
  min-width: 177px;
  position: absolute;
  right: 0;
  bottom: -9.5px;
  transform: translateY(100%);
  background: ${colors.neutral_700};
  border-radius: 4px;
  z-index: ${zIndex.dropdown};
`;

const MenuItem = styled(Button).attrs({ typo: "body_1" })`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 20px;
  height: 42px;
  cursor: pointer;
  text-align: left;
  color: ${colors.neutral_0};
`;
