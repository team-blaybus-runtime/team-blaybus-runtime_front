"use client";

import { Column, Grid, Row } from "@/styles/base/BaseComponents";
import Pagination from "@/component/common/Pagination";
import { Font } from "@/styles/typo/typography";
import React from "react";
import MemoCard from "./MemoCard";

export default function UserMemo() {
  return (
    <Column width="100%" gridGap="30px" flexShrink="0">
      <Row width="100%" pt="40px">
        <Font typo="title_1" color="neutral_0">
          Memo
        </Font>
      </Row>
      <Column width="100%" justifyContent="center" pb="43px" gridGap="30px">
        <Grid gridTemplateColumns="repeat(2, 1fr)" gridGap="30px">
          <MemoCard />
          <MemoCard />
          <MemoCard />
          <MemoCard />
          <MemoCard />
          <MemoCard />
        </Grid>
        <Pagination currentPage={1} totalPages={7} onPageChange={() => {}} />
      </Column>
    </Column>
  );
}
