"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Div, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import MemoMenu from "./MemoMenu";
import type { StudyMemo } from "@/type/memo";

interface MemoDetailModalProps {
  memo: StudyMemo;
  onClose: () => void;
}

export default function MemoDetailModal({
  memo,
  onClose,
}: MemoDetailModalProps) {
  return (
    <Overlay onClick={onClose}>
      <Card onClick={(event) => event.stopPropagation()}>
        <Content>
          <Header>
            <Font typo="title_3" color="neutral_0">
              {memo.title}
            </Font>
            <Img
              src="/icons/mypage/modalCancel.svg"
              alt="close"
              width="20px"
              height="20px"
              onClick={onClose}
            />
          </Header>
          <Body>
            <Font typo="caption_s" color="neutral_300">
              {memo.content || "내용을 입력해주세요."}
            </Font>
          </Body>
        </Content>
        <Footer>
          <Font typo="caption_s" color="neutral_500">
            {memo.updatedAt}
          </Font>
          <MemoMenu />
        </Footer>
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
  background-color: ${colors.neutral_900};
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
  align-items: center;
  justify-content: space-between;
`;

const Body = styled(Column)`
  flex: 1 1 auto;
  min-height: 0;
`;

const Footer = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
