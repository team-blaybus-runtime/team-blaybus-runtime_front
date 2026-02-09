"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

interface QuizHeaderProps {
  title: string;
  subtitle?: string;
  onRetry?: () => void;
  onGrade?: () => void;
  isGradeDisabled?: boolean;
  hideActions?: boolean;
}

export default function QuizHeader({
  title,
  subtitle,
  onRetry,
  onGrade,
  isGradeDisabled = false,
  hideActions = false,
}: QuizHeaderProps) {
  return (
    <HeaderRow>
      <HeaderInfo>
        <Font typo="title_3" color="neutral_0">
          {title}
        </Font>
        {subtitle && (
          <Font typo="label_s" color="neutral_400">
            {subtitle}
          </Font>
        )}
      </HeaderInfo>
      {!hideActions && (
        <ActionRow>
          <SecondaryButton onClick={onRetry}>랜덤 출제</SecondaryButton>
          <PrimaryButton onClick={onGrade} disabled={isGradeDisabled}>
            채점하기
          </PrimaryButton>
        </ActionRow>
      )}
    </HeaderRow>
  );
}

const HeaderRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const HeaderInfo = styled(Column)`
  gap: 6px;
`;

const ActionRow = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const PrimaryButton = styled(Button)`
  padding: 8px 14px;
  border-radius: 10px;
  background-color: ${colors.blue_700};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 600;
`;

const SecondaryButton = styled(Button)`
  padding: 8px 12px;
  border-radius: 10px;
  background-color: #2c2c2c;
  color: ${colors.neutral_200};
  font-size: 13px;
  font-weight: 500;
`;
