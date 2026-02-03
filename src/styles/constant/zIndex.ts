/**
 * Z-Index 관리 - 애플리케이션 전체에서 사용되는 z-index 값들을 관리합니다.
 */

export const zIndex = {
  base: 0,
  element: 10,
  dropdown: 100,
  sticky: 200,
  header: 500,
  fixed: 600,
  bottomsheet: 600,
  mobileheader: 700,
  overlay: 900,
  modal: 1000,
  alert: 1100,
  toast: 1200,
  max: 9999,
} as const;

export type ZIndexLevel = (typeof zIndex)[keyof typeof zIndex];
