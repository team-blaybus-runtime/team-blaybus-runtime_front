import React from "react";
import { CenterColumn } from "@/styles/base/BaseComponents";
import FormInput from "@/component/common/FormInput";

interface LoginInfoValues {
  email: string;
  password: string;
}

interface LoginInfoErrors {
  email?: string;
  password?: string;
}

interface LoginInfoProps {
  values: LoginInfoValues;
  errors: LoginInfoErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LoginInfo({ values, errors, onChange }: LoginInfoProps) {
  return (
    <CenterColumn width="100%" gridGap="10px">
      <FormInput
        label="이메일"
        placeholder="이메일을 입력해주세요."
        name="email"
        value={values.email}
        onChange={onChange}
        errorMessage={errors.email}
      />
      <FormInput
        label="패스워드"
        placeholder="패스워드를 입력해주세요."
        type="password"
        name="password"
        value={values.password}
        onChange={onChange}
        errorMessage={errors.password}
      />
    </CenterColumn>
  );
}
