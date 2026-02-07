"use client";

import { CenterRow } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import { useRouter } from "next/navigation";

export default function AlreadyAccount() {
  const router = useRouter();
  return (
    <CenterRow width="100%" gridGap="8px" p="16px 4px">
      <Font typo="button_2" color="neutral_300">
        이미 계정이 있으신가요?
      </Font>

      <Font
        typo="button_2"
        color="blue_700"
        onClick={() => router.push("/login")}
        style={{ cursor: "pointer" }}
      >
        로그인
      </Font>
    </CenterRow>
  );
}
