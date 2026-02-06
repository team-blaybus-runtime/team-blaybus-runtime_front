import { Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

export default function MainInfo() {
  return (
    <Row width="100%" pt="80px" gridGap="40px" alignItems="flex-end">
      <Font typo="headline_l" color={colors.white} flex="1">
        {"3D 물리 시뮬레이터"}
      </Font>
      <Font typo="body_1" color={colors.neutral_200} flex="1">
        {
          "3D 조작과 AI 설명으로 복잡한 기계 구조를 쉽게 학습하세요.\n지금 바로, 지난 작업부터 이어서 시작할 수 있어요."
        }
      </Font>
    </Row>
  );
}
