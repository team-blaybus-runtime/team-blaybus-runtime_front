"use client";

import { CenterColumn } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import { Button } from "@/styles/base/BaseStyledTags";
import AlreadyAccount from "@/component/register/AlreadyAccount";
import RegisterInfo from "@/component/register/RegisterInfo";
import { useRouter } from "next/navigation";
import { C } from "@/constant";

export default function Register() {
  const router = useRouter();

  return (
    <CenterColumn width="100%" height="100%">
      <CenterColumn width="480px" gridGap="24px">
        <Font typo="title_1" color="neutral_0">
          회원가입
        </Font>
        <RegisterInfo />
        <Button
          type="button"
          width="100%"
          bg="blue_700"
          p="12px 8px"
          alignItems="center"
          borderRadius="8px"
          onClick={() => {
            try {
              sessionStorage.setItem(C.SHOW_PROFILE_SETUP_KEY, "1");
            } catch {}
            router.push("/main");
          }}
        >
          <Font typo="button_1" color="neutral_0">
            회원가입
          </Font>
        </Button>
        <AlreadyAccount />
      </CenterColumn>
    </CenterColumn>
  );
}
