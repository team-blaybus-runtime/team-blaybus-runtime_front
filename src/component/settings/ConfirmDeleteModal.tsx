"use client";

import styled from "styled-components";
import { CenterColumn, Column, Row } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";

interface ConfirmDeleteModalProps {
  open: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({
  open,
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <Overlay aria-modal="true" role="dialog" onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Column width="100%" gridGap="8px">
          <Font typo="title_2" color="neutral_0">
            정말로 탈퇴하시겠습니까?
          </Font>
          <Font typo="caption_m" color="neutral_500">
            탈퇴 후에는 계정 복구가 불가능합니다.
          </Font>
        </Column>

        <ButtonRow>
          <CancelButton type="button" onClick={onClose} disabled={isPending}>
            취소
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm} disabled={isPending}>
            탈퇴하기
          </ConfirmButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled(CenterColumn)`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: ${colors.alpha_dark_70};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: ${zIndex.modal};
`;

const Modal = styled(Column)`
  width: 90%;
  max-width: 420px;
  background: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 24px;
  gap: 20px;
`;

const ButtonRow = styled(Row)`
  width: 100%;
  gap: 10px;
`;

const CancelButton = styled(Button)`
  flex: 1;
  padding: 12px 8px;
  border-radius: 8px;
  background: ${colors.neutral_800};
  color: ${colors.neutral_0};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: ${colors.neutral_700};
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled(Button)`
  flex: 1;
  padding: 12px 8px;
  border-radius: 8px;
  background: ${colors.red_600};
  color: ${colors.neutral_0};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: ${colors.neutral_700};
    cursor: not-allowed;
  }
`;
