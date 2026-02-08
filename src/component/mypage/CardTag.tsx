import { CenterRow } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

interface CardTagProps {
  productTypeDesc: string;
}

export default function CardTag({ productTypeDesc }: CardTagProps) {
  return (
    <CenterRow
      width="fit-content"
      height="fit-content"
      p="1px 10px"
      bg="blue_700"
      borderRadius="5px"
    >
      <Font typo="label_s" color="neutral_0">
        {productTypeDesc ?? "타입 없음"}
      </Font>
    </CenterRow>
  );
}
