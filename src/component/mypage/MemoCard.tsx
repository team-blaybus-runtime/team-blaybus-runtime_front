import { Column, Row } from "@/styles/base/BaseComponents";
import { Font, FontLine } from "@/styles/typo/typography";
import CardTag from "@/component/mypage/CardTag";

interface MemoCardProps {
  title: string;
  tag: string;
  preview: string;
  createdAt: string;
  onClick?: () => void;
}

export default function MemoCard({
  title,
  tag,
  preview,
  createdAt,
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
        <Font typo="title_2" color="neutral_0">
          {title}
        </Font>
        <CardTag tag={tag} />
      </Row>

      <Row width="100%" height="auto">
        <FontLine typo="body_2" color="neutral_0" line={1}>
          {preview}
        </FontLine>
      </Row>

      <Row width="100%" height="auto" py="9px">
        <Font typo="caption_s" color="neutral_500">
          작성일 {createdAt}
        </Font>
      </Row>
    </Column>
  );
}
