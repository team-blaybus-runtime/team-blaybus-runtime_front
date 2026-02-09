"use client";

import { CenterColumn } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import { Button } from "@/styles/base/BaseStyledTags";
import AlreadyAccount from "@/component/register/AlreadyAccount";
import RegisterInfo from "@/component/register/RegisterInfo";
import { useRegisterForm } from "@/hooks/auth/useRegisterForm";
import colors from "@/styles/constant/colors";

export default function Register() {
  const { values, errors, isSubmitDisabled, handleChange, handleSubmit } =
    useRegisterForm();

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitDisabled) handleSubmit();
  };

  return (
    <CenterColumn width="100%" height="100%">
      <form onSubmit={onFormSubmit} style={{ display: "contents" }}>
        <CenterColumn width="480px" gridGap="24px">
          <Font typo="title_1" color="neutral_0">
            회원가입
          </Font>
          <RegisterInfo values={values} errors={errors} onChange={handleChange} />
          <Button
            type="submit"
            width="100%"
            bg={isSubmitDisabled ? colors.neutral_700 : colors.blue_700}
            p="12px 8px"
            alignItems="center"
            borderRadius="8px"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            <Font typo="button_1" color="neutral_0">
              회원가입
            </Font>
          </Button>
          <AlreadyAccount />
        </CenterColumn>
      </form>
    </CenterColumn>
  );
}
