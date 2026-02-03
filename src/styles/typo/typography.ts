import styled from "styled-components";
import { Noto_Sans_KR } from "next/font/google";
import { Div } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";

const Default = styled(Div)`
  white-space: pre-line;

  word-break: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  letter-spacing: -0.1px;
`;

const Font = styled(Default)<{ $color?: string }>`
  color: ${({ $color }) => $color || colors.black};
`;

export const noto_kr = Noto_Sans_KR({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const fonts = { noto_kr };

export { Font, fonts };
