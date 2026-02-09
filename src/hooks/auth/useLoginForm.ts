"use client";

import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { usePostSignInMutation } from "@/queries/auth/usePostSignInMutation";
import type { SignInRequest, SignUpErrorResponse } from "@/type/user";

type LoginErrors = {
  email: string;
  password: string;
  submit: string;
};

const INITIAL_VALUES: SignInRequest = {
  email: "",
  password: "",
};

const INITIAL_ERRORS: LoginErrors = {
  email: "",
  password: "",
  submit: "",
};

const mapLoginErrors = (
  payload: SignUpErrorResponse | undefined,
  fallbackMessage: string,
): { errorFields: (keyof SignInRequest)[]; errors: LoginErrors } => {
  const fieldErrors = payload?.fieldErrors ?? {};
  const nextErrorFields = Object.keys(fieldErrors) as (keyof SignInRequest)[];
  const hasFieldErrors = nextErrorFields.length > 0;
  const defaultErrorFields: (keyof SignInRequest)[] = ["email"];

  return {
    errorFields: hasFieldErrors ? nextErrorFields : defaultErrorFields,
    errors: {
      ...INITIAL_ERRORS,
      email: fieldErrors.email ?? (hasFieldErrors ? "" : fallbackMessage),
      password: fieldErrors.password ?? "",
      submit: "",
    },
  };
};

export function useLoginForm() {
  const { mutate, isPending } = usePostSignInMutation({
    onError: (error) => {
      if (!axios.isAxiosError(error)) {
        setErrors((prev) => ({
          ...prev,
          submit: "알 수 없는 오류가 발생했습니다.",
        }));
        return;
      }

      const payload = error.response?.data as SignUpErrorResponse | undefined;
      const { errorFields, errors } = mapLoginErrors(
        payload,
        payload?.message ?? error.message,
      );
      setErrorFields(errorFields);
      setErrors(errors);
    },
  });
  const [values, setValues] = useState<SignInRequest>(INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginErrors>(INITIAL_ERRORS);
  const [lastSubmitValues, setLastSubmitValues] =
    useState<SignInRequest>(INITIAL_VALUES);
  const [errorFields, setErrorFields] = useState<(keyof SignInRequest)[]>([]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const hasEmptyValue = useMemo(
    () => Object.values(values).some((value) => !value),
    [values],
  );

  const isSubmitDisabled = isPending || hasEmptyValue;

  const handleSubmit = useCallback(() => {
    const hasAnyInput = Object.values(values).some((value) => value);
    if (!hasAnyInput) return;

    setLastSubmitValues(values);

    mutate(values);
  }, [mutate, values]);

  return {
    values,
    errors,
    isPending,
    isSubmitDisabled,
    handleChange,
    handleSubmit,
  };
}
