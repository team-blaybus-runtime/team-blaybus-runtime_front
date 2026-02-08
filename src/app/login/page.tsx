"use client";

import { CenterColumn } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import LoginInfo from "@/component/login/LoginInfo";
import { Button } from "@/styles/base/BaseStyledTags";
import NoAccount from "@/component/login/NoAccount";
import colors from "@/styles/constant/colors";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

export default function Login() {
  const { values, errors, isSubmitDisabled, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <CenterColumn width="100%" height="100%">
      <CenterColumn width="480px" gridGap="24px">
        <Font typo="title_1" color="neutral_0">
          로그인
        </Font>
        <LoginInfo values={values} errors={errors} onChange={handleChange} />
        <Button
          width="100%"
          bg={isSubmitDisabled ? colors.neutral_700 : colors.blue_700}
          p="12px 8px"
          alignItems="center"
          borderRadius="8px"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          <Font typo="button_1" color="neutral_0">
            로그인
          </Font>
        </Button>
        <NoAccount />
      </CenterColumn>
    </CenterColumn>
  );
}
