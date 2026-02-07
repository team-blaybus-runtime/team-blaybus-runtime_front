"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import MemoMenu from "./MemoMenu";
import type { StudyMemo } from "@/type/memo";

interface MemoCardItemProps {
  memo: StudyMemo;
  onOpen: (id: number) => void;
}

export default function MemoCardItem({ memo, onOpen }: MemoCardItemProps) {
  return (
    <CardContainer
      bg="alpha_light_10"
      width="100%"
      height="auto"
      borderRadius="12px"
      p="14.5px 17px"
      minHeight="240px"
      onClick={() => onOpen(memo.id)}
    >
      <Column width="100%" gridGap="15px" flex="1">
        <Font typo="title_3" color="neutral_0">
          {memo.title}
        </Font>
        <Font typo="caption_s" color="neutral_300">
          {memo.content}
        </Font>
      </Column>
      <Row width="100%" justifyContent="space-between" alignItems="center">
        <Font typo="caption_s" color="neutral_500">
          {memo.updatedAt}
        </Font>
        <MemoMenu />
      </Row>
    </CardContainer>
  );
}

const CardContainer = styled(Column)`
  cursor: pointer;
`;
