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
          <Font typo="caption_s" color={colors.neutral_500}>
            분해 진행도
          </Font>
          <Font typo="caption_s" color={colors.blue_500}>
            {percent}%
          </Font>
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
          <Font typo="caption_s" color={colors.neutral_600}>
            완전 조립
          </Font>
          <Font typo="caption_s" color={colors.neutral_600}>
            완전 분해
          </Font>
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

const SliderInput = styled.input<{ $percent: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2000px;
  background: linear-gradient(
    to right,
    ${colors.blue_700} ${(p) => p.$percent}%,
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
    background: ${colors.blue_700};
    border: 2px solid ${colors.neutral_0};
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${colors.blue_700};
    border: 2px solid ${colors.neutral_0};
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
`;

const SliderLabels = styled(Row)`
  width: 100%;
  justify-content: space-between;
  margin-top: 2px;
`;
