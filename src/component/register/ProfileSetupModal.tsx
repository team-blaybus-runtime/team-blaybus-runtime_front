"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Button, Div } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import FormInput from "@/component/common/FormInput";

export interface ProfileSetupValues {
  name: string;
  major: string;
  goal: string;
}

interface ProfileSetupModalProps {
  open: boolean;
  /** 요구사항상 배경 클릭/페이지 이동을 막기 위한 모달이라, 닫기 UI는 기본 제공하지 않습니다. */
  onSubmit: (values: ProfileSetupValues) => void;
  defaultValues?: Partial<ProfileSetupValues>;
}

function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

export default function ProfileSetupModal({
  open,
  onSubmit,
  defaultValues,
}: ProfileSetupModalProps) {
  const initial = useMemo(
    () => ({
      name: defaultValues?.name ?? "",
      major: defaultValues?.major ?? "",
      goal: defaultValues?.goal ?? "",
    }),
    [defaultValues?.goal, defaultValues?.major, defaultValues?.name],
  );

  const [values, setValues] = useState<ProfileSetupValues>(initial);

  useEffect(() => {
    if (!open) return;
    setValues(initial);
  }, [open, initial]);

  // 모달이 뜨는 동안 배경 스크롤 완전 차단 + 레이아웃 시프트 보정
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
    values.name.trim() && values.major.trim() && values.goal.trim();

  return (
    <Overlay aria-modal="true" role="dialog">
      <Modal>
        <Column gridGap="8px">
          <Font typo="title_1" color={colors.neutral_0}>
            만나서 반가워요!
          </Font>
          <Font typo="body_2" color={colors.neutral_500}>
            프로필을 설정하고 서비스를 이용해 보세요.
          </Font>
        </Column>

        <Column gridGap="2px">
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
            label="목표"
            placeholder="예) 분해도 이해하기"
            value={values.goal}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, goal: e.target.value }))
            }
          />
        </Column>

        <CTA type="button" disabled={!isValid} onClick={() => onSubmit(values)}>
          <Font
            typo="button_2"
            color={colors.neutral_0}
            width="100%"
            textAlign="center"
          >
            설정 완료
          </Font>
        </CTA>
        <Div />
      </Modal>
    </Overlay>
  );
}

const Overlay = styled(Div)`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: ${colors.alpha_dark_70};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: ${zIndex.modal};

  display: flex;
  align-items: center;
  justify-content: center;
  overscroll-behavior: contain;
`;

const Modal = styled(Column)`
  width: 520px;
  max-width: calc(100% - 48px);
  background: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 28px 28px 24px;
  gap: 18px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
`;

const CTA = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  background: ${colors.blue_700};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
