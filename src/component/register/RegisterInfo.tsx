import React from "react";
import { CenterColumn } from "@/styles/base/BaseComponents";
import FormInput from "@/component/common/FormInput";
import type { RegisterErrors, RegisterValues } from "@/type/user";

interface RegisterInfoProps {
  values: RegisterValues;
  errors: Pick<RegisterErrors, "email" | "password" | "confirmPassword">;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RegisterInfo({
  values,
  errors,
  onChange,
}: RegisterInfoProps) {
  return (
    <CenterColumn width="100%" gridGap="10px">
      <FormInput
        label="이메일"
        placeholder="user@email.com"
        name="email"
        value={values.email}
        onChange={onChange}
        errorMessage={errors.email}
      />
      <FormInput
        label="패스워드"
        placeholder="영문, 숫자를 조합한 6자 이상"
        type="password"
        name="password"
        value={values.password}
        onChange={onChange}
        errorMessage={errors.password}
      />
      <FormInput
        label="패스워드 확인"
        placeholder="패스워드를 다시 입려해 주세요."
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={onChange}
        errorMessage={errors.confirmPassword}
      />
    </CenterColumn>
  );
}
