"use client";

import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { CenterColumn, Column, Row } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import FormInput from "@/component/common/FormInput";

interface CreateWorkflowModalProps {
  open: boolean;
  isCreating?: boolean;
  onCreate: (title: string) => void;
  onClose: () => void;
}

export default function CreateWorkflowModal({
  open,
  isCreating = false,
  onCreate,
  onClose,
}: CreateWorkflowModalProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed || isCreating) return;
      onCreate(trimmed);
    },
    [title, isCreating, onCreate],
  );

  const handleClose = useCallback(() => {
    if (!isCreating) {
      setTitle("");
      onClose();
    }
  }, [isCreating, onClose]);

  useEffect(() => {
    if (open) setTitle("");
  }, [open]);

  if (!open) return null;

  return (
    <Overlay aria-modal="true" role="dialog" onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Font typo="title_3" color="alpha_light_90">
          새 워크플로우
        </Font>
        <Form onSubmit={handleSubmit}>
          <FormInput
            label="제목"
            placeholder="워크플로우 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            disabled={isCreating}
          />
          <ButtonRow>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={isCreating}
            >
              취소
            </CancelButton>
            <ConfirmButton type="submit" disabled={!title.trim() || isCreating}>
              {isCreating ? "생성 중..." : "만들기"}
            </ConfirmButton>
          </ButtonRow>
        </Form>
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
  border: 1px solid ${colors.alpha_light_10};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  color: ${colors.alpha_light_90};
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled(Button)`
  flex: 1;
  padding: 12px 8px;
  border-radius: 8px;
  background: ${colors.alpha_light_20};
  color: ${colors.neutral_0};
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
