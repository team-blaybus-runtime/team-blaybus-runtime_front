"use client";

import { useChangePasswordForm } from "@/hooks/settings/useChangePasswordForm";
import styled from "styled-components";
import { CenterColumn, Column, Row } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import FormInput from "@/component/common/FormInput";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const {
    values,
    errors,
    isPending,
    isSubmitDisabled,
    handleChange,
    handleSubmit,
  } = useChangePasswordForm({ open, onClose });

  if (!open) return null;

  return (
    <Overlay aria-modal="true" role="dialog" onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Header>
          <Font typo="title_2" color="neutral_0">
            비밀번호 변경
          </Font>
          <CloseButton type="button" onClick={onClose}>
            <Img
              src="/icons/mypage/modalCancel.svg"
              alt="close"
              width="20px"
              height="20px"
            />
          </CloseButton>
        </Header>

        <Column width="100%" gridGap="12px">
          <FormInput
            label="현재 비밀번호"
            type="password"
            value={values.oldPassword}
            onChange={(event) =>
              handleChange("oldPassword", event.target.value)
            }
            placeholder="현재 비밀번호를 입력하세요"
            errorMessage={errors.oldPassword}
          />
          <FormInput
            label="새 비밀번호"
            type="password"
            value={values.newPassword}
            onChange={(event) =>
              handleChange("newPassword", event.target.value)
            }
            placeholder="새 비밀번호를 입력하세요"
            errorMessage={errors.newPassword}
          />
          <FormInput
            label="새 비밀번호 확인"
            type="password"
            value={values.confirmPassword}
            onChange={(event) =>
              handleChange("confirmPassword", event.target.value)
            }
            placeholder="새 비밀번호를 다시 입력하세요"
            errorMessage={errors.confirmPassword}
          />
        </Column>

        <CTA type="button" disabled={isSubmitDisabled} onClick={handleSubmit}>
          <Font typo="button_2" color={colors.neutral_0}>
            변경 완료
          </Font>
        </CTA>
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
  max-width: 480px;
  background: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 24px;
  gap: 20px;
`;

const Header = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CloseButton = styled(Button)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CTA = styled(Button)`
  width: 100%;
  padding: 12px 8px;
  border-radius: 8px;
  background: ${colors.blue_700};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: ${colors.neutral_700};
    cursor: not-allowed;
  }
`;
