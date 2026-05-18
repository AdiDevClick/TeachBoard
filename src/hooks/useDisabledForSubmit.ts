import type { UseDisabledForSubmitOptions } from "@/hooks/types/use-disabled-for-submit.types";
import { useMemo } from "react";

/**
 * Custom hook to determine if a submit button should be disabled based on the form state.
 *
 * @description The submit button will be disabled if any of the following conditions are true:
 * - The form has been submitted successfully.
 * - The form is currently being submitted.
 * - There are any validation errors present in the form.
 * - The form is not valid.
 * - The form is currently being validated.
 *
 * @param formState - The form state object from react-hook-form.
 * @return A boolean indicating whether the submit button should be disabled.
 */
export function useDisabledForSubmit(formState?: UseDisabledForSubmitOptions) {
  const isDisabled = useMemo(() => {
    if (!formState) return false;

    const hasAnyErrors = Object.keys(formState.errors).length > 0;

    return (
      formState.isSubmitSuccessful ||
      formState.isSubmitting ||
      hasAnyErrors ||
      !formState.isValid ||
      formState.isValidating
    );
  }, [formState]);

  return isDisabled;
}
