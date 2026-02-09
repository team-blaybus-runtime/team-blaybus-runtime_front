"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

export default function QuizEmptyState() {
  return (
    <EmptyState>
      <Font typo="body_2" color="neutral_300">
        해당 학습물의 퀴즈가 아직 준비되지 않았어요.
      </Font>
    </EmptyState>
  );
}

const EmptyState = styled(Column)`
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
