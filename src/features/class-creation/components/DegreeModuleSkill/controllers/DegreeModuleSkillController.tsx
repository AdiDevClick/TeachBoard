import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { HTTP_METHODS } from "@/configs/app.config.ts";
import { degreeSubSkillsCreationInputControllers } from "@/features/class-creation/components/DegreeModuleSkill/forms/degree-module-skill-inputs";
import type { DegreeModuleSkillControllerProps } from "@/features/class-creation/components/DegreeModuleSkill/types/degree-module-skill.types.ts";
import { useDebouncedChecker } from "@/features/class-creation/components/main/hooks/useDebouncedChecker";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import type { ChangeEvent } from "react";

/**
 * DegreeModuleSkillController component
 *
 * @param pageId - The unique identifier for the page or component instance
 * @param formId - The unique identifier for the form
 * @param inputControllers - An array of input controller configurations
 * @param className - Additional CSS classes for styling the form
 * @param form - The react-hook-form instance managing the form state
 * @param submitRoute - The API endpoint for form submission
 * @param submitDataReshapeFn - Function to reshape data before submission
 * @returns
 */
export function DegreeModuleSkillController({
  pageId,
  formId,
  inputControllers = degreeSubSkillsCreationInputControllers,
  form,
  className,
  submitRoute = API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
  submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_SKILL.dataReshape,
}: DegreeModuleSkillControllerProps) {
  const { setRef, observedRefs, submitCallback } = useCommandHandler({
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
  const handleValueChange = (
    event: ChangeEvent<HTMLInputElement>,
    meta?: CommandHandlerFieldMeta,
  ) => {
    const fieldName = meta?.name;

    if (!fieldName) {
      return;
    }

    availabilityCheck(event, {
      ...meta,
      searchParams: { filterBy: fieldName },
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
        control={form.control}
        setRef={setRef}
        observedRefs={observedRefs}
        onChange={handleValueChange}
      />
    </form>
  );
}
