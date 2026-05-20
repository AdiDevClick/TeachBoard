import {
  useForm,
  useFormState,
  type FieldValues,
  type FormState,
  type UseFormReturn,
} from "react-hook-form";

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
export function useDisabledForSubmit(
  form: UseFormReturn<FieldValues> | FormState<FieldValues>,
  options?: { forceSubscribe?: boolean },
) {
  const fallbackForm = useForm<FieldValues>();
  const hasControl = "control" in form;
  const formState = hasControl ? form.formState : form;

  const forcedSubscribeProps = useFormState({
    control: hasControl ? form.control : fallbackForm.control,
  });

  const formVariable =
    options?.forceSubscribe && hasControl ? forcedSubscribeProps : formState;

  const hasAnyErrors = Object.keys(formVariable.errors).length > 0;

  return (
    formVariable.isSubmitSuccessful ||
    formVariable.isSubmitting ||
    hasAnyErrors ||
    !formVariable.isValid ||
    formVariable.isValidating
  );
}
