import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";

export function TaskItemController({
  pageId = "task-controller",
  formId,
  inputControllers,
  className = "grid gap-4",
  form,
}: Readonly<TaskItemControllerProps>) {
  const { setRef, observedRefs, submitCallback } = useCommandHandler({
    form,
    pageId,
  });

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    submitCallback(variables, null, API_ENDPOINTS.POST.CREATE_TASK.dataReshape);
  };

  const id = formId ?? pageId + "-form";

  return (
    <form
      id={id}
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
