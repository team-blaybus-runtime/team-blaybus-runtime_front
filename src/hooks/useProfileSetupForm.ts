import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { usePostUserProfileMutation } from "@/queries/users/usePostUserProfileMutation";
import type {
  ProfileSetup,
  ProfileSetupErrors,
  ProfileSetupField,
  ProfileSetupFormValues,
} from "@/type/user";

const INITIAL_ERRORS: ProfileSetupErrors = {
  nickname: "",
  major: "",
  grade: "",
  goal: "",
  submit: "",
};

interface UseProfileSetupFormParams {
  open: boolean;
  defaultValues?: Partial<ProfileSetup>;
  onSubmit: (values: ProfileSetup) => void;
  onClose?: () => void;
}

export function useProfileSetupForm({
  open,
  defaultValues,
  onSubmit,
  onClose,
}: UseProfileSetupFormParams) {
  const { mutate, isPending } = usePostUserProfileMutation();

  const initial = useMemo(
    () => ({
      nickname: defaultValues?.nickname ?? "",
      major: defaultValues?.major ?? "",
      grade: defaultValues?.grade ? String(defaultValues.grade) : "",
      goal: defaultValues?.goal ?? "",
    }),
    [
      defaultValues?.goal,
      defaultValues?.major,
      defaultValues?.nickname,
      defaultValues?.grade,
    ],
  );

  const [values, setValues] = useState<ProfileSetupFormValues>(initial);
  const [errors, setErrors] = useState<ProfileSetupErrors>(INITIAL_ERRORS);
  const [errorFields, setErrorFields] = useState<ProfileSetupField[]>([]);
  const [lastSubmitValues, setLastSubmitValues] =
    useState<ProfileSetupFormValues>(initial);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setValues(initial);
      setErrors(INITIAL_ERRORS);
      setErrorFields([]);
      setLastSubmitValues(initial);
    }
    wasOpenRef.current = open;
  }, [open, initial]);

  const handleFieldChange = (
    field: keyof ProfileSetupFormValues,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "", submit: "" }));
  };

  const isValid = useMemo(
    () =>
      values.nickname.trim() &&
      values.major.trim() &&
      values.goal.trim() &&
      values.grade.trim(),
    [values],
  );

  const hasUnchangedErrorField = useMemo(
    () =>
      errorFields.some((field) => values[field] === lastSubmitValues[field]),
    [errorFields, lastSubmitValues, values],
  );

  const isSubmitDisabled = !isValid || isPending || hasUnchangedErrorField;

  const handleSubmit = () => {
    setLastSubmitValues(values);
    const payload: ProfileSetup = {
      nickname: values.nickname,
      major: values.major,
      grade: Number(values.grade),
      goal: values.goal,
    };

    mutate(payload, {
      onSuccess: () => {
        onSubmit(payload);
        onClose?.();
      },
      onError: (error) => {
        if (!axios.isAxiosError(error)) {
          setErrors((prev) => ({
            ...prev,
            submit: "알 수 없는 오류가 발생했습니다.",
          }));
          return;
        }

        const payloadError = error.response?.data as
          | { message?: string; fieldErrors?: Record<string, string> }
          | undefined;
        const fieldErrors = payloadError?.fieldErrors ?? {};
        const nextErrorFields = Object.keys(fieldErrors) as ProfileSetupField[];
        setErrorFields(nextErrorFields);
        setErrors({
          nickname: fieldErrors.nickname ?? "",
          major: fieldErrors.major ?? "",
          grade: fieldErrors.grade ?? "",
          goal: fieldErrors.goal ?? "",
          submit: payloadError?.message ?? error.message,
        });
      },
    });
  };

  return {
    values,
    errors,
    isPending,
    isSubmitDisabled,
    handleFieldChange,
    handleSubmit,
  };
}
