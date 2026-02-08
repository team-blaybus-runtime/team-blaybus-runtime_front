import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { C } from "@/constant";
import { usePostSignUpMutation } from "@/queries/auth/usePostSignUp";
import type {
  RegisterErrors,
  RegisterErrorField,
  RegisterValues,
} from "@/type/user";

const INITIAL_VALUES: RegisterValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const INITIAL_ERRORS: RegisterErrors = {
  email: "",
  password: "",
  confirmPassword: "",
  submit: "",
};

export function useRegisterForm() {
  const router = useRouter();
  const { mutate, isPending } = usePostSignUpMutation();
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<RegisterErrors>(INITIAL_ERRORS);
  const [errorFields, setErrorFields] = useState<RegisterErrorField[]>([]);
  const [lastSubmitValues, setLastSubmitValues] =
    useState<RegisterValues>(INITIAL_VALUES);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const hasEmptyValue = useMemo(
    () => Object.values(values).some((value) => !value),
    [values],
  );

  const hasPasswordMismatch = useMemo(
    () => values.password !== values.confirmPassword,
    [values],
  );

  const hasUnchangedErrorField = useMemo(
    () =>
      errorFields.some((field) => values[field] === lastSubmitValues[field]),
    [errorFields, lastSubmitValues, values],
  );

  const isSubmitDisabled =
    isPending || hasEmptyValue || hasPasswordMismatch || hasUnchangedErrorField;

  const handleSubmit = useCallback(() => {
    const hasAnyInput = Object.values(values).some((value) => value);
    if (!hasAnyInput) {
      return;
    }

    setLastSubmitValues(values);

    mutate(
      {
        username: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          try {
            sessionStorage.setItem(C.SHOW_PROFILE_SETUP_KEY, "1");
          } catch {}
          router.push("/main");
        },
        onError: (error) => {
          if (!axios.isAxiosError(error)) {
            setErrors((prev) => ({
              ...prev,
              submit: "알 수 없는 오류가 발생했습니다.",
            }));
            return;
          }

          const payload = error.response?.data;
          const fieldErrors = payload?.fieldErrors ?? {};
          const nextErrorFields: RegisterErrorField[] = [];
          if (fieldErrors.username || payload?.username) {
            nextErrorFields.push("email");
          }
          if (fieldErrors.password || payload?.password) {
            nextErrorFields.push("password");
          }
          if (fieldErrors.confirmPassword || payload?.confirmPassword) {
            nextErrorFields.push("confirmPassword");
          }

          setErrorFields(nextErrorFields);
          setErrors({
            email: fieldErrors.username ?? payload?.username ?? "",
            password: fieldErrors.password ?? payload?.password ?? "",
            confirmPassword:
              fieldErrors.confirmPassword ?? payload?.confirmPassword ?? "",
            submit: payload?.message ?? error.message,
          });
        },
      },
    );
  }, [router, values]);

  return {
    values,
    errors,
    isPending,
    isSubmitDisabled,
    handleChange,
    handleSubmit,
  };
}
