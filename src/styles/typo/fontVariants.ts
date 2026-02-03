export const typoVariants = {
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

export const typoConfig = {
  prop: "typo",
  variants: typoVariants,
} as const;
