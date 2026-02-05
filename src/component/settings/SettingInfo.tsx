import { CenterRow, Row } from "@/styles/base/BaseComponents";
import MenuCard from "@/component/settings/MenuCard";

export default function SettingInfo() {
  return (
    <Row width="100%" height="100%" p="24px 0px 232px 0px">
      <CenterRow width="100%" height="284px" gridGap="24px">
        <MenuCard type="account" />
        <MenuCard type="support" />
      </CenterRow>
    </Row>
  );
}
