"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import {
  Button,
  Div,
  Img,
  Input,
  TextArea,
} from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import MemoMenu from "./MemoMenu";
import type { MemoItem } from "@/type/memo";
import useMemoDetailModal from "@/hooks/study/useMemoDetailModal";
import { formatDate } from "@/utils/formatDate";

interface MemoDetailModalProps {
  memo: MemoItem;
  onClose: () => void;
  onEditingChange?: (isEditing: boolean) => void;
}

export default function MemoDetailModal({
  memo,
  onClose,
  onEditingChange,
}: MemoDetailModalProps) {
  const {
    isEditing,
    editTitle,
    editContent,
    isSaveDisabled,
    setEditTitle,
    setEditContent,
    handleEditStart,
    handleSave,
    handleDelete,
  } = useMemoDetailModal({ memo, onClose, onEditingChange });

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(event) => event.stopPropagation()}>
        <Content>
          <Header>
            {isEditing ? (
              <TitleBlock>
                <TitleInput
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(event.target.value.slice(0, 25))
                  }
                  placeholder="제목을 입력해주세요."
                  maxLength={25}
                />
                <CountRow>
                  <Font typo="caption_s" color="neutral_500">
                    {editTitle.length}/25
                  </Font>
                </CountRow>
              </TitleBlock>
            ) : (
              <Font typo="title_3" color="neutral_0">
                {memo.title}
              </Font>
            )}
            <Img
              src="/icons/mypage/modalCancel.svg"
              alt="close"
              width="20px"
              height="20px"
              onClick={onClose}
            />
          </Header>
          <Body>
            {isEditing ? (
              <ContentEditWrapper>
                <ContentTextArea
                  value={editContent}
                  onChange={(event) =>
                    setEditContent(event.target.value.slice(0, 230))
                  }
                  placeholder="내용을 입력해주세요."
                  maxLength={230}
                />
                <CountRow>
                  <Font typo="caption_s" color="neutral_500">
                    {editContent.length}/230
                  </Font>
                </CountRow>
              </ContentEditWrapper>
            ) : (
              <Font typo="caption_s" color="neutral_300">
                {memo.content || "내용을 입력해주세요."}
              </Font>
            )}
          </Body>
        </Content>
        {isEditing ? (
          <EditFooter>
            <SaveButton onClick={handleSave} disabled={isSaveDisabled}>
              수정 완료
            </SaveButton>
          </EditFooter>
        ) : (
          <Footer>
            <Font typo="caption_s" color="neutral_500">
              {formatDate(memo.updatedAt)}
            </Font>
            <MemoMenu onEdit={handleEditStart} onDelete={handleDelete} />
          </Footer>
        )}
      </Card>
    </Overlay>
  );
}

const Overlay = styled(Div)`
  position: absolute;
  inset: 0;
  z-index: ${zIndex.dropdown};
  pointer-events: auto;
  background-color: ${colors.alpha_dark_60};
`;

const Card = styled(Column)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${colors.neutral_1000};
  border-radius: 12px;
  padding: 20px 19px;
  gap: 19px;
  min-height: 0;
`;

const Content = styled(Column)`
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  gap: 15px;
`;

const Header = styled(Row)`
  width: 100%;
  align-items: start;
  justify-content: space-between;
`;

const TitleBlock = styled(Column)`
  flex: 1;
  gap: 6px;
`;

const TitleInput = styled(Input)`
  width: 100%;
  background: transparent;
  color: ${colors.neutral_0};
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  line-height: 1.4;
  padding: 0;

  &::placeholder {
    color: ${colors.neutral_400};
  }
`;

const Body = styled(Column)`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
`;

const ContentEditWrapper = styled(Column)`
  height: 100%;
  min-height: 240px;
  gap: 6px;
`;

const CountRow = styled(Row)`
  justify-content: flex-start;
  align-items: center;
`;

const ContentTextArea = styled(TextArea)`
  width: 100%;
  height: 100%;
  background: transparent;
  color: ${colors.neutral_300};
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  padding: 0;

  &::placeholder {
    color: ${colors.neutral_400};
  }
`;

const Footer = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const EditFooter = styled(Row)`
  width: 100%;
  justify-content: center;
`;

const SaveButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background-color: ${colors.blue_700};
  color: ${colors.neutral_0};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
