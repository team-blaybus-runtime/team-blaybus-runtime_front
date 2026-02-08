import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { usePutPasswordMutation } from "@/queries/auth/usePutPasswordMutation";

const INITIAL_VALUES = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const INITIAL_ERRORS = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  submit: "",
};

interface UseChangePasswordFormParams {
  open: boolean;
  onClose: () => void;
}

export const useChangePasswordForm = ({
  open,
  onClose,
}: UseChangePasswordFormParams) => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const { mutate, isPending } = usePutPasswordMutation();

  useEffect(() => {
    if (!open) return;
    setValues(INITIAL_VALUES);
    setErrors(INITIAL_ERRORS);
  }, [open]);

  const hasMismatch =
    values.newPassword !== "" &&
    values.confirmPassword !== "" &&
    values.newPassword !== values.confirmPassword;

  const isSubmitDisabled =
    isPending ||
    !values.oldPassword ||
    !values.newPassword ||
    !values.confirmPassword ||
    hasMismatch;

  const handleChange = useCallback(
    (field: keyof typeof INITIAL_VALUES, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({
        ...prev,
        [field]: "",
        submit: "",
      }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (isSubmitDisabled) return;
    if (values.newPassword !== values.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "새 비밀번호가 일치하지 않습니다.",
      }));
      return;
    }

    mutate(
      {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          if (!axios.isAxiosError(error)) {
            setErrors((prev) => ({
              ...prev,
              oldPassword: "알 수 없는 오류가 발생했습니다.",
            }));
            return;
          }

          const payload = error.response?.data as
            | { fieldErrors?: Record<string, string>; message?: string }
            | undefined;
          const fieldErrors = payload?.fieldErrors ?? {};
          const hasFieldErrors = Object.keys(fieldErrors).length > 0;

          setErrors({
            oldPassword: fieldErrors.oldPassword ?? "",
            newPassword: fieldErrors.newPassword ?? "",
            confirmPassword: fieldErrors.confirmPassword ?? "",
            submit: "",
          });

          if (!hasFieldErrors) {
            setErrors((prev) => ({
              ...prev,
              oldPassword: payload?.message ?? "알 수 없는 오류가 발생했습니다.",
            }));
          }
        },
      },
    );
  }, [isSubmitDisabled, mutate, onClose, values]);

  return {
    values,
    errors,
    isPending,
    isSubmitDisabled,
    handleChange,
    handleSubmit,
  };
};
