"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

interface StudyContentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StudyContentModal({ open, onClose }: StudyContentModalProps) {
  if (!open) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <DescriptionContainer>
          <Font typo="label_l" color={colors.neutral_100}>
            타이틀
          </Font>
        </DescriptionContainer>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </ModalHeader>
    </ModalContainer>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 5L5 15M5 5l10 10"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ModalContainer = styled(Column)`
  width: 443px;
  max-width: 720px;
  height: 100%;
  background-color: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 24px 32px;
  overflow: hidden;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const ModalHeader = styled(Row)`
  gap: 8px;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
`;

const DescriptionContainer = styled(Column)`
  flex: 1;
`;

const CloseButton = styled(Button)`
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;
