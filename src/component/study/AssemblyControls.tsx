"use client";

import { useCallback } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { useModelStore } from "@/store/useModelStore";

export default function AssemblyControls() {
  const explodeLevel = useModelStore((s) => s.explodeLevel);
  const setExplodeLevel = useModelStore((s) => s.setExplodeLevel);

  const percent = Math.round(explodeLevel * 100);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExplodeLevel(Number(e.target.value) / 100);
    },
    [setExplodeLevel],
  );

  return (
    <Container>
      <LabelRow>
        <Font typo="label_s" color={colors.neutral_0}>
          조립 / 분해
        </Font>
        <ProgressLabel>
          <ProgressText>분해 진행도</ProgressText>
          <PercentText>{percent}%</PercentText>
        </ProgressLabel>
      </LabelRow>

      <SliderWrapper>
        <SliderInput
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={handleChange}
          $percent={percent}
        />
        <SliderLabels>
          <SliderLabelText>완전 조립</SliderLabelText>
          <SliderLabelText>완전 분해</SliderLabelText>
        </SliderLabels>
      </SliderWrapper>
    </Container>
  );
}

const Container = styled(Column)`
  width: 365px;
  background-color: ${colors.neutral_900};
  border-radius: 16px;
  padding: 10px 20px 8px;
  gap: 5px;
  align-items: center;
`;

const LabelRow = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const ProgressLabel = styled(Row)`
  gap: 6px;
  align-items: center;
`;

const SliderWrapper = styled(Column)`
  width: 325px;
  gap: 0;
`;

const ProgressText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
  color: ${colors.neutral_500};
`;

const PercentText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
  color: ${colors.blue_500};
`;

const SliderInput = styled.input<{ $percent: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2000px;
  background: linear-gradient(
    to right,
    ${colors.blue_500} ${(p) => p.$percent}%,
    ${colors.neutral_700} ${(p) => p.$percent}%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${colors.blue_500};
    border: none;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${colors.blue_500};
    border: none;
    cursor: pointer;
  }
`;

const SliderLabels = styled(Row)`
  width: 100%;
  justify-content: space-between;
  margin-top: 2px;
`;

const SliderLabelText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 20px;
  color: ${colors.neutral_600};
`;
