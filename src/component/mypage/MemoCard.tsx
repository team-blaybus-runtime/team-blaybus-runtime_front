import { CenterRow, Column, Row } from "@/styles/base/BaseComponents";
import { Font, FontLine } from "@/styles/typo/typography";
import React from "react";

export default function MemoCard() {
  return (
    <Column
      width="100%"
      bg="neutral_900"
      borderRadius="20px"
      p="20.5px 20px 20.5px 40px"
    >
      <Row width="100%" height="100%" alignItems="center" gridGap="10px">
        <Font typo="title_2" color="neutral_0">
          머신 바이스 체결할때 헷갈린점
        </Font>
        <CenterRow
          width="fit-content"
          height="fit-content"
          px="10px"
          bg="blue_700"
          borderRadius="5px"
        >
          <Font typo="label_s" color="neutral_0">
            Machine Vice
          </Font>
        </CenterRow>
      </Row>

      <Row width="100%" height="auto">
        <FontLine typo="body_2" color="neutral_0" line={1}>
          ・죠(jaw) 간격 조절 시 나사 피치 중요 ・체결 시 미끄럼 방지용 톱니
          구조 확인 간격 조절 시 나사 피치 중요 ・체결 시 미끄럼 방지용 톱니
          구조 확인
        </FontLine>
      </Row>

      <Row width="100%" height="auto" py="9px">
        <Font typo="caption_s" color="neutral_500">
          작성일 2026.02.03
        </Font>
      </Row>
    </Column>
  );
}
