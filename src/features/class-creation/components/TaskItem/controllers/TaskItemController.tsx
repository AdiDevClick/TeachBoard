import { FormWithDebug } from "@/components/Form/FormWithDebug";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { HTTP_METHODS } from "@/configs/app.config.ts";
import { useDebouncedChecker } from "@/features/class-creation/components/main/hooks/useDebouncedChecker";
import type { TaskItemControllerProps } from "@/features/class-creation/components/TaskItem/types/task-item.types.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import type { ChangeEvent } from "react";

/**
 * Controller component for creating a new task item.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 */
export function TaskItemController({
  pageId,
  formId,
  inputControllers = [],
  className = "grid gap-4",
  form,
  submitRoute = API_ENDPOINTS.POST.CREATE_TASK.endpoint,
  submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_TASK.dataReshape,
}: TaskItemControllerProps) {
  const { setRef, observedRefs, submitCallback, invalidSubmitCallback } =
    useCommandHandler({
      form,
      pageId,
      submitRoute,
      submitDataReshapeFn,
    });

  const { availabilityCheck } = useDebouncedChecker(form, 300);

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    submitCallback(variables, {
      method: HTTP_METHODS.POST,
    });
  };

  /**
   * Send a debouned API request to check for class name availability when the class name input changes.
   *
   * @param event - The change event from the class name input
   * @param meta - Optional metadata for the command handler, including API endpoint information
   */
  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement>,
    meta?: CommandHandlerFieldMeta,
  ) => {
    const fieldName = meta?.name;

    if (fieldName !== "name" || !fieldName) {
      return;
    }

    availabilityCheck(event, {
      ...meta,
      searchParams: { by: fieldName },
    });
  };

  return (
    <FormWithDebug
      form={form}
      formId={formId}
      pageId={pageId}
      className={className}
      onValidSubmit={handleSubmit}
      onInvalidSubmit={invalidSubmitCallback}
    >
      <ControlledInputList
        items={inputControllers}
        control={form.control}
        setRef={setRef}
        observedRefs={observedRefs}
        onChange={handleOnChange}
      />
    </FormWithDebug>
  );
}
