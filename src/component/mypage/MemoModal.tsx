"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import CardTag from "@/component/mypage/CardTag";

interface MemoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tag: string;
  items: string[];
}

export default function MemoModal({
  open,
  onClose,
  title,
  tag,
  items,
}: MemoModalProps) {
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <Overlay>
      <Modal gridGap="30px">
        <HeaderRow px="60px">
          <Row alignItems="center" gridGap="12px">
            <Font typo="title_2" color="neutral_0">
              {title}
            </Font>
            <CardTag tag={tag} />
          </Row>
          <Img
            src="/icons/mypage/modalCancel.svg"
            width="36px"
            height="36px"
            alt="close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </HeaderRow>

        <Divider />

        <Body px="60px" pt="20px">
          {items.map((text, index) => (
            <Font typo="body_1" color="neutral_0" key={`${index}-${text}`}>
              • {text}
            </Font>
          ))}
        </Body>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled(Column)`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: ${colors.alpha_dark_70};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
`;

const Modal = styled(Column)`
  width: 1200px;
  min-width: 1200px;
  height: 700px;
  max-height: calc(100% - 48px);
  background-color: ${colors.neutral_900};
  border-radius: 20px;
  padding: 30px 0px;
`;

const HeaderRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.neutral_800};
`;

const Body = styled(Column)`
  flex: 1;
  overflow-y: auto;
  gap: 12px;
  padding-right: 8px;
`;
