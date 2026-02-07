import { CenterColumn, CenterRow, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import LoginInfo from "@/component/login/LoginInfo";
import { Button } from "@/styles/base/BaseStyledTags";
import NoAccount from "@/component/login/NoAccount";

export default function Login() {
  return (
    <CenterColumn width="100%" height="100%">
      <CenterColumn width="480px" gridGap="24px">
        <Font typo="title_1" color="neutral_0">
          로그인
        </Font>
        <LoginInfo />
        <Button
          width="100%"
          bg="blue_700"
          p="12px 8px"
          alignItems="center"
          borderRadius="8px"
        >
          <Font typo="button_1" color="neutral_0">
            로그인
          </Font>
        </Button>
        <NoAccount />
      </CenterColumn>
    </CenterColumn>
  );
}
