import { CenterColumn, CenterRow } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import SettingInfo from "@/component/settings/SettingInfo";

export default function Settings() {
  return (
    <CenterColumn width="100%" height="100%">
      <CenterRow width="100%" height="124px">
        <Font typo="headline_s" color="neutral_0">
          어떤 것을 도와드릴까요?
        </Font>
      </CenterRow>
      <SettingInfo />
    </CenterColumn>
  );
}
