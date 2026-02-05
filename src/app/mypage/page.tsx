import { CenterColumn, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import UserSummary from "@/component/mypage/UserSummary";
import UserMemo from "@/component/mypage/UserMemo";

export default function Mypage() {
  return (
    <CenterColumn width="100%" height="100%" px="360px">
      <Row width="100%" height="130px">
        <Font typo="title_1" color="neutral_0">
          OOO님 안녕하세요!
        </Font>
      </Row>
      <UserSummary />
      <UserMemo />
    </CenterColumn>
  );
}

