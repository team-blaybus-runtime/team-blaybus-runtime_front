import { CenterColumn, Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import React from "react";

export default function WorkflowPage() {
  // styled system 사용 방식 예시
  return (
    <CenterColumn width="100%" height="1500px" bg="gray_500">
      <Font typo="m01_bold_m" color="blue_500">
        Font 컴포넌트 사용하는 방식 예시입니다.
      </Font>

      <Row p="20px 10px 20px 10px" bg="white">
        <Column width="100px" height="100px" bg="red_500"></Column>
      </Row>
    </CenterColumn>
  );
}
