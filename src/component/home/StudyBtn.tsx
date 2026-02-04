import { CenterRow } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";

export default function StudyBtn() {
  return (
    <CenterRow
      p="10px 12px"
      bg="blue_700"
      borderRadius="8px"
      gridGap="4px"
      width="104px"
      height="40px"
      style={{
        cursor: "pointer",
      }}
    >
      <Font typo="button_2" color="neutral_0">
        학습하기
      </Font>
      <Img
        src="/icons/common/rightArrow.svg"
        alt="study-arrow"
        width="20px"
        height="20px"
      />
    </CenterRow>
  );
}
