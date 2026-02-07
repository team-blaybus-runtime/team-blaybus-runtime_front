"use client";

import { CenterRow } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import { useRouter } from "next/navigation";

export default function NoAccount() {
  const router = useRouter();
  return (
    <CenterRow width="100%" gridGap="8px" p="16px 4px">
      <Font typo="button_2" color="neutral_300">
        계정이 없으신가요?
      </Font>

      <Font
        typo="button_2"
        color="blue_700"
        onClick={() => router.push("/register")}
        style={{ cursor: "pointer" }}
      >
        계정 만들기
      </Font>
    </CenterRow>
  );
}
