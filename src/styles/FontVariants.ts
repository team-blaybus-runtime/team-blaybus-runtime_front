export const typoVariants = {
  /**
   * Main Logo
   */
  m01_bold_m: {
    fontFamily: "Nunito-Extra, sans-serif",
    fontWeight: "700",
    fontSize: "25px",
    lineHeight: "normal",
  },
} as const;

export type TypoVariant = keyof typeof typoVariants;

export type TypoProps = {
  typo?: TypoVariant;
};

/**
 * `styled-system`의 `variant()`에 넘기는 설정.
 */
export const typoConfig = {
  prop: "typo",
  variants: typoVariants,
} as const;
