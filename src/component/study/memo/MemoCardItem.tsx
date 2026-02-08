"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Font, FontLine } from "@/styles/typo/typography";
import type { MemoItem } from "@/type/memo";
import { formatDate } from "@/utils/formatDate";

interface MemoCardItemProps {
  memo: MemoItem;
  onOpen: (id: string) => void;
}

export default function MemoCardItem({ memo, onOpen }: MemoCardItemProps) {
  return (
    <CardContainer
      bg="alpha_light_10"
      width="100%"
      height="auto"
      borderRadius="12px"
      p="14.5px 17px"
      gridGap="10px"
      minHeight="240px"
      onClick={() => onOpen(memo.memoId)}
    >
      <Column width="100%" gridGap="15px" flex="1">
        <FontLine typo="title_3" color="neutral_0" line={1}>
          {memo.title}
        </FontLine>
        <FontLine typo="caption_s" color="neutral_300" line={8}>
          {memo.content}
        </FontLine>
      </Column>
      <Font typo="caption_s" color="neutral_500">
        {formatDate(memo.updatedAt)}
      </Font>
    </CardContainer>
  );
}

const CardContainer = styled(Column)`
  cursor: pointer;
`;
