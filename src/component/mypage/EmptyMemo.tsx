import { CenterRow, Grid } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

export default function EmptyMemo() {
  return (
    <Grid
      gridTemplateColumns="repeat(2, 1fr)"
      gridGap="30px"
      width="100%"
      px="45px"
    >
      <CenterRow
        width="100%"
        height="100%"
        bg="neutral_900"
        borderRadius="20px"
        p="38.5px 0px"
      >
        <Font typo="title_3" color="neutral_500">
          아직 작성된 메모가 없습니다. <br />
          학습 중 중요한 메모를 기록해보세요.
        </Font>
      </CenterRow>
      <CenterRow
        width="100%"
        height="100%"
        bg="neutral_900"
        borderRadius="20px"
        p="38.5px 0px"
      >
        <Font typo="title_3" color="neutral_500">
          아직 작성된 메모가 없습니다. <br />
          학습 중 중요한 메모를 기록해보세요.
        </Font>
      </CenterRow>
    </Grid>
  );
}
