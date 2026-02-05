import styled from "styled-components";
import { Div } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";
import { fontFamily, letterSpacing } from "./fontVariants";

const Default = styled(Div)`
  white-space: pre-line;

  word-break: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-family: ${fontFamily.base};
  letter-spacing: ${letterSpacing.default};
`;

const Font = styled(Default)<{ color?: string }>`
  color: ${({ color }) => color || colors.black};
`;

const FontLine = styled(Font)<{ line?: number }>`
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.line ?? 0};
  overflow: hidden;
`;

const fonts = { ...fontFamily };

export { Font, FontLine, fonts };
