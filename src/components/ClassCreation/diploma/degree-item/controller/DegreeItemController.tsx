import type { DegreeItemControllerProps } from "@/components/ClassCreation/diploma/degree-item/types/degree-item.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeCreationInputControllersField } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";

/**
 * Controller component for creating a new degree item.
 *
 * !! IMPORTANT !! Be sure that the inputControllers passed to this component are already validated by Zod Schema.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 */
export function DegreeItemController({
  pageId,
  inputControllers = degreeCreationInputControllersField,
  className = "grid gap-4",
  formId,
  form,
}: Readonly<DegreeItemControllerProps>) {
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
    submitCallback(
      variables,
      null,
      API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
    );
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
