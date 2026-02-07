"use client";

import React from "react";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Input } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import type { TypoVariant } from "@/styles/typo/fontVariants";
import colors from "@/styles/constant/colors";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder?: string;
  errorMessage?: string;
};

export default function FormInput({
  label,
  placeholder,
  errorMessage,
  ...inputProps
}: FormInputProps) {
  const hasError = Boolean(errorMessage);

  return (
    <Column width="100%" gridGap="4px" py={errorMessage ? "0px" : "10px"}>
      <Font typo="label_s" color={colors.neutral_500}>
        {label}
      </Font>

      <StyledInput
        {...inputProps}
        placeholder={placeholder}
        aria-invalid={hasError}
        $hasError={hasError}
        typo="caption_m"
      />
      {hasError && (
        <Font typo="caption_s" color="red_700">
          *{errorMessage}
        </Font>
      )}
    </Column>
  );
}

const StyledInput = styled(Input)<{ $hasError: boolean }>`
  width: 100%;
  height: 48px;
  padding: 8px;
  border-radius: 8px;
  background: ${colors.neutral_900};
  color: ${colors.neutral_0};
  border: 1px solid
    ${({ $hasError }) => ($hasError ? colors.red_700 : colors.neutral_900)};
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.neutral_600};
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? colors.red_700 : colors.blue_700};
  }
`;
