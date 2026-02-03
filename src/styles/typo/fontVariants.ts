// todo: 디자인 typo font 반영 필요

export const fontFamily = {
  base: "Pretendard, sans-serif",
} as const;

export const fontWeights = {
  bold: 700,
  regular: 400,
  light: 300,
} as const;

export const fontSizes = {
  xxs: "12px",
  xs: "14px",
  sm: "16px",
  md: "18px",
  lg: "20px",
  xl: "24px",
  size_22: "22px",
  size_28: "28px",
  size_32: "32px",
  size_40: "40px",
  "2xl": "36px",
  "3xl": "48px",
  "4xl": "56px",
  "5xl": "64px",
  "6xl": "72px",
  "7xl": "80px",
  "8xl": "96px",
  "9xl": "128px",
} as const;

export const lineHeights = {
  xs: "12px",
  s: "16px",
  m: "20px",
  l: "24px",
  pct_125: "125%",
  pct_140: "140%",
  pct_180: "180%",
} as const;

export const letterSpacing = {
  default: "0px",
} as const;

type ResponsiveFontSize = readonly [string, string, string];
type TypoVariantValue = {
  fontFamily: string;
  fontWeight: number;
  fontSize: string | ResponsiveFontSize;
  lineHeight: string;
  letterSpacing: string;
};

const responsiveSize = (
  desktop: string,
  tablet: string,
  mobile: string,
): ResponsiveFontSize => [desktop, tablet, mobile] as const;

export const typoVariants = {
  hero: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(
      fontSizes["9xl"],
      fontSizes["8xl"],
      fontSizes["6xl"],
    ),
    lineHeight: lineHeights.pct_125,
    letterSpacing: letterSpacing.default,
  },
  headline_l: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(
      fontSizes["5xl"],
      fontSizes["3xl"],
      fontSizes["2xl"],
    ),
    lineHeight: lineHeights.pct_125,
    letterSpacing: letterSpacing.default,
  },
  headline_m: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes["4xl"], fontSizes.size_40, fontSizes.size_32),
    lineHeight: lineHeights.pct_125,
    letterSpacing: letterSpacing.default,
  },
  headline_s: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes["3xl"], fontSizes["2xl"], fontSizes.size_28),
    lineHeight: lineHeights.pct_125,
    letterSpacing: letterSpacing.default,
  },
  title_1: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes["2xl"], fontSizes.size_28, fontSizes.xl),
    lineHeight: lineHeights.pct_140,
    letterSpacing: letterSpacing.default,
  },
  title_2: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.xl, fontSizes.size_22, fontSizes.lg),
    lineHeight: lineHeights.pct_140,
    letterSpacing: letterSpacing.default,
  },
  title_3: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.lg, fontSizes.md, fontSizes.md),
    lineHeight: lineHeights.pct_140,
    letterSpacing: letterSpacing.default,
  },
  label_l: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.md, fontSizes.sm, fontSizes.sm),
    lineHeight: lineHeights.l,
    letterSpacing: letterSpacing.default,
  },
  label_m: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.sm, fontSizes.xs, fontSizes.xs),
    lineHeight: lineHeights.l,
    letterSpacing: letterSpacing.default,
  },
  label_s: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.xs, fontSizes.xxs, fontSizes.xxs),
    lineHeight: lineHeights.m,
    letterSpacing: letterSpacing.default,
  },
  body_1: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.regular,
    fontSize: responsiveSize(fontSizes.md, fontSizes.sm, fontSizes.sm),
    lineHeight: lineHeights.pct_180,
    letterSpacing: letterSpacing.default,
  },
  body_2: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.regular,
    fontSize: responsiveSize(fontSizes.sm, fontSizes.xs, fontSizes.xs),
    lineHeight: lineHeights.pct_180,
    letterSpacing: letterSpacing.default,
  },
  button_1: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.md, fontSizes.sm, fontSizes.sm),
    lineHeight: lineHeights.l,
    letterSpacing: letterSpacing.default,
  },
  button_2: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.sm, fontSizes.xs, fontSizes.xs),
    lineHeight: lineHeights.m,
    letterSpacing: letterSpacing.default,
  },
  button_3: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.bold,
    fontSize: responsiveSize(fontSizes.xs, fontSizes.xxs, fontSizes.xxs),
    lineHeight: lineHeights.m,
    letterSpacing: letterSpacing.default,
  },
  caption_l: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.regular,
    fontSize: responsiveSize(fontSizes.md, fontSizes.sm, fontSizes.sm),
    lineHeight: lineHeights.l,
    letterSpacing: letterSpacing.default,
  },
  caption_m: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.regular,
    fontSize: responsiveSize(fontSizes.sm, fontSizes.xs, fontSizes.xs),
    lineHeight: lineHeights.m,
    letterSpacing: letterSpacing.default,
  },
  caption_s: {
    fontFamily: fontFamily.base,
    fontWeight: fontWeights.regular,
    fontSize: responsiveSize(fontSizes.xs, fontSizes.xxs, fontSizes.xxs),
    lineHeight: lineHeights.s,
    letterSpacing: letterSpacing.default,
  },
} as const satisfies Record<string, TypoVariantValue>;

export type TypoVariant = keyof typeof typoVariants;

export type TypoProps = {
  typo?: TypoVariant;
};

export const typoConfig = {
  prop: "typo",
  variants: typoVariants,
} as const;
