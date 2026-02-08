import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { usePostSignUpMutation } from "@/queries/auth/usePostSignUpMutation";
import type {
  RegisterErrors,
  RegisterField,
  RegisterForm,
  SignUpErrorResponse,
} from "@/type/user";

const INITIAL_VALUES: RegisterForm = {
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

const mapRegisterErrors = (
  payload: SignUpErrorResponse | undefined,
  fallbackMessage: string,
) => {
  const fieldErrors = payload?.fieldErrors ?? {};
  const nextErrorFields = Object.keys(fieldErrors) as RegisterField[];
  const hasFieldErrors = nextErrorFields.length > 0;
  const submit = nextErrorFields.length ? "" : fallbackMessage;

  return {
    errorFields: nextErrorFields,
    errors: {
      ...INITIAL_ERRORS,
      email: fieldErrors.email ?? (!hasFieldErrors ? fallbackMessage : ""),
      password: fieldErrors.password ?? "",
      confirmPassword: fieldErrors.confirmPassword ?? "",
      submit,
    },
  };
};

export function useRegisterForm() {
  const { mutate, isPending } = usePostSignUpMutation({
    onError: (error) => {
      if (!axios.isAxiosError(error)) {
        setErrors((prev) => ({
          ...prev,
          submit: "알 수 없는 오류가 발생했습니다.",
        }));
        return;
      }

      const payload = error.response?.data as SignUpErrorResponse | undefined;
      const { errorFields, errors } = mapRegisterErrors(
        payload,
        payload?.message ?? error.message,
      );
      setErrorFields(errorFields);
      setErrors(errors);
    },
  });
  const [values, setValues] = useState<RegisterForm>(INITIAL_VALUES);
  const [errors, setErrors] = useState<RegisterErrors>(INITIAL_ERRORS);
  const [errorFields, setErrorFields] = useState<RegisterField[]>([]);
  const [lastSubmitValues, setLastSubmitValues] =
    useState<RegisterForm>(INITIAL_VALUES);

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

    mutate({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
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
