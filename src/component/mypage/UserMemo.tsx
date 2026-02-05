import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import React from "react";

export default function UserMemo() {
  return <Column width="100%" height="100%" gridGap="30px">
    <Row width="100%" height="90px">
      <Font typo="title_1" color="neutral_0">
        Memo
      </Font>
    </Row>
  </Column>;
}
