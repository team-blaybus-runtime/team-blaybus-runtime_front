import { CenterColumn, Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import React from "react";

export default function WorkflowPage() {
  // styled system 사용 방식 예시
  return (
    <CenterColumn width="100%" height="1500px" bg="blue_300">
      <Font typo="hero" color="blue_800">
        Font 컴포넌트 사용하는 방식 예시입니다.
      </Font>

      <Row p="20px 10px 20px 10px" bg="alpha_light_10">
        <CenterColumn width="auto" height="100px" bg="red_50" px="20px">
          <Font typo="headline_s" color="red_600">
            Font 컴포넌트 사용하는 방식 예시입니다.
          </Font>
        </CenterColumn>
      </Row>
    </CenterColumn>
  );
}
