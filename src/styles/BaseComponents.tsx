"use client";

import styled from "styled-components";
import { Div, ITagProps } from "@/styles/BaseStyledTags";

const Column = styled(Div)<ITagProps>`
  display: flex;
  flex-direction: column;
`;

const Row = styled(Div)<ITagProps>`
  display: flex;
  flex-direction: row;
`;

const CenterRow = styled(Div)<ITagProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CenterColumn = styled(Div)<ITagProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Grid = styled(Div)<ITagProps>`
  display: grid;
`;

export { Column, Row, Grid, CenterRow, CenterColumn };
