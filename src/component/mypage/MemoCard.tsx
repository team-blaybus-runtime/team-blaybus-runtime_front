import { Column, Row } from "@/styles/base/BaseComponents";
import { Font, FontLine } from "@/styles/typo/typography";
import CardTag from "@/component/mypage/CardTag";
import { formatDateOnly } from "@/utils/formatDate";

interface MemoCardProps {
  title: string;
  productTypeDesc: string;
  content: string;
  updatedAt: string;
  onClick?: () => void;
}

export default function MemoCard({
  title,
  productTypeDesc,
  content,
  updatedAt,
  onClick,
}: MemoCardProps) {
  return (
    <Column
      width="100%"
      bg="neutral_900"
      borderRadius="20px"
      p="20.5px 20px 20.5px 40px"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Row width="100%" height="100%" alignItems="center" gridGap="10px">
        <FontLine typo="title_2" color="neutral_0" line={1}>
          {title}
        </FontLine>
        <CardTag productTypeDesc={productTypeDesc} />
      </Row>

      <Row width="100%" height="auto">
        <FontLine typo="body_2" color="neutral_0" line={1}>
          {content}
        </FontLine>
      </Row>

      <Row width="100%" height="auto" py="9px">
        <Font typo="caption_s" color="neutral_500">
          작성일 {formatDateOnly(updatedAt)}
        </Font>
      </Row>
    </Column>
  );
}
