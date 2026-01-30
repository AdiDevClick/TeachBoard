import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { HTTP_METHODS } from "@/configs/app.config.ts";
import type { TaskItemControllerProps } from "@/features/class-creation/components/TaskItem/types/task-item.types.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";

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
  const { setRef, observedRefs, submitCallback } = useCommandHandler({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

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

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={inputControllers}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
      />
    </form>
  );
}
