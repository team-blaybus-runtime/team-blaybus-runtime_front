import { CenterRow } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

export default function CardTag({ tag }: { tag: string }) {
  return (
    <CenterRow
      width="fit-content"
      height="fit-content"
      p="1px 10px"
      bg="blue_700"
      borderRadius="5px"
    >
      <Font typo="label_s" color="neutral_0">
        {tag}
      </Font>
    </CenterRow>
  );
}
