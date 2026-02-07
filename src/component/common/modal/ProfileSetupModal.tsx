"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CenterColumn, CenterRow, Column } from "@/styles/base/BaseComponents";
import { Button, Div } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import FormInput from "@/component/common/FormInput";
import { ProfileSetupValues } from "@/type/user";

interface ProfileSetupModalProps {
  open: boolean;
  onSubmit: (values: ProfileSetupValues) => void;
  onClose?: () => void;
  defaultValues?: Partial<ProfileSetupValues>;
}

function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

export default function ProfileSetupModal({
  open,
  onSubmit,
  onClose,
  defaultValues,
}: ProfileSetupModalProps) {
  const initial = useMemo(
    () => ({
      name: defaultValues?.name ?? "",
      major: defaultValues?.major ?? "",
      grade: defaultValues?.grade ?? "",
      goal: defaultValues?.goal ?? "",
    }),
    [
      defaultValues?.goal,
      defaultValues?.major,
      defaultValues?.name,
      defaultValues?.grade,
    ],
  );

  const [values, setValues] = useState<ProfileSetupValues>(initial);

  useEffect(() => {
    if (!open) return;
    setValues(initial);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const sbw = getScrollbarWidth();

    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  if (!open) return null;

  const isValid =
    values.name.trim() &&
    values.major.trim() &&
    values.goal.trim() &&
    values.grade.trim();

  return (
    <Overlay aria-modal="true" role="dialog">
      <Modal>
        <Column width="100%" gridGap="24px">
          <Font typo="title_1" color="neutral_0">
            만나서 반가워요!
          </Font>
          <Font typo="caption_m" color="neutral_500">
            프로필을 설정하고 서비스를 이용해 보세요.
          </Font>
        </Column>

        <Column gridGap="16px">
          <Column width="100%">
            <FormInput
              label="이름"
              placeholder="예) 김도사"
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <FormInput
              label="전공"
              placeholder="예) 기계공학과"
              value={values.major}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, major: e.target.value }))
              }
            />
            <FormInput
              label="학년"
              placeholder="예) 2학년"
              value={values.grade}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, grade: e.target.value }))
              }
            />
            <FormInput
              label="목표"
              placeholder="예) 분해도 이해하기"
              value={values.goal}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, goal: e.target.value }))
              }
            />
          </Column>

          <CTA
            type="button"
            disabled={!isValid}
            onClick={() => onSubmit(values)}
          >
            <Font
              typo="button_2"
              color={colors.neutral_0}
              width="100%"
              textAlign="center"
            >
              설정 완료
            </Font>
          </CTA>
        </Column>

        <CenterRow width="100%" gridGap="8px" p="16px 4px">
          <Font typo="button_2" color="neutral_300">
            프로필은 마이페이지에서 언제든 설정 가능합니다
          </Font>

          <Font
            typo="button_2"
            color="blue_700"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            둘러보기
          </Font>
        </CenterRow>
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

  overscroll-behavior: contain;
`;

const Modal = styled(Column)`
  width: 80%;
  max-width: 480px;
  background: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 24px;
  gap: 24px;
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
