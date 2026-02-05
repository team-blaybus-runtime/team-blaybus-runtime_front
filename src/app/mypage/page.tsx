import { CenterColumn, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import UserSummary from "@/component/mypage/UserSummary";
import UserMemo from "@/component/mypage/UserMemo";
import { Suspense } from "react";

export default function Mypage() {
  return (
    <CenterColumn width="100%" flexShrink="0">
      <Row width="100%" height="130px" pt="80px" flexShrink="0">
        <Font typo="title_1" color="neutral_0">
          OOO님 안녕하세요!
        </Font>
      </Row>
      <UserSummary />
      <Suspense fallback={null}>
        <UserMemo />
      </Suspense>
    </CenterColumn>
  );
}
