"use client";
import styled from "styled-components";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

interface NewStudyBtnProps {
  onClick?: () => void;
}

export default function NewStudyBtn({ onClick }: NewStudyBtnProps) {
  return (
    <StyledButton onClick={onClick}>
      <Font typo="button_2" color={colors.neutral_0}>
        새로 학습하기
      </Font>
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 4px 8px;
  background-color: ${colors.blue_700};
  border-radius: 8px;
`;
