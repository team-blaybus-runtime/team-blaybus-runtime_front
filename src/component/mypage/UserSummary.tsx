import { CenterRow, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

export default function UserSummary() {
  const summaryItems = [
    { label: "전공", value: "기계공학과" },
    { label: "학년", value: "2학년" },
    { label: "목표", value: "분해도 이해하기" },
  ] as const;

  return (
    <CenterRow width="100%" height="140px" py="30px" flexShrink="0">
      <CenterRow
        width="100%"
        height="80px"
        px="80px"
        bg="neutral_900"
        borderRadius="20px"
        justifyContent="space-between"
      >
        {/* 학생 정보 관련 부분 */}
        <Row width="100%" gridGap="30px" alignItems="center">
          {summaryItems.map(({ label, value }) => (
            <CenterRow key={label} gridGap="10px">
              <Font typo="title_2" color="neutral_0">
                {label}
              </Font>
              <Font typo="body_1" color="neutral_0">
                {value}
              </Font>
            </CenterRow>
          ))}
        </Row>
        <CenterRow
          width="80px"
          height="34px"
          bg="neutral_600"
          borderRadius="8px"
        >
          <Font typo="button_3" color="neutral_0">
            수정하기
          </Font>
        </CenterRow>
      </CenterRow>
    </CenterRow>
  );
}
