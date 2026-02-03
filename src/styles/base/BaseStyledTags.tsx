"use client";

import styled, { css } from "styled-components";
import {
  BackgroundProps,
  BorderProps,
  ColorProps,
  FlexboxProps,
  GridProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
  background,
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  space,
  typography,
  variant,
} from "styled-system";
import type { TypoProps } from "@/styles/typo/fontVariants";
import { typoConfig } from "@/styles/typo/fontVariants";

const styles = compose(
  color,
  flexbox,
  grid,
  layout,
  position,
  border,
  space,
  typography,
  background,
  variant(typoConfig)
);
export interface ITagProps
  extends ColorProps,
    FlexboxProps,
    LayoutProps,
    BorderProps,
    PositionProps,
    TypographyProps,
    GridProps,
    BackgroundProps,
    SpaceProps,
    TypoProps {}

const A = styled.a<ITagProps>`
  ${styles}
`;

const Div = styled.div<ITagProps>`
  ${styles}
  white-space: pre-line;
`;

const Img = styled.img<ITagProps>`
  ${styles}
`;

const Span = styled.span<ITagProps>`
  ${styles}
`;

const Input = styled.input<ITagProps>`
  outline: 0;
  border: none;
  ${styles}
`;

const TextArea = styled.textarea<ITagProps>`
  outline: 0;
  border: none;
  white-space: pre-line;
  word-break: break-word;
  resize: vertical;
  ${styles}
`;

const Option = styled.option<ITagProps>`
  ${styles}
`;

const Ol = styled.ol<ITagProps>`
  ${styles}
`;

const Ul = styled.ul<ITagProps>`
  ${styles}
`;

const Li = styled.li<ITagProps>`
  ${styles}
`;

const Button = styled.button<ITagProps>`
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  ${styles}

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
    `}
`;

const I = styled.i<ITagProps>`
  ${styles}
`;

export function withStyle<T = object>(Component: React.ComponentType<T>) {
  return styled(Component)<ITagProps & T>`
    ${styles}
  `;
}

export { A, Button, Div, I, Img, Input, Li, Ol, Option, Span, TextArea, Ul };
