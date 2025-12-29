import type { DegreeModuleSkillProps } from "@/components/ClassCreation/diploma/degree-module-skill/types/degree-module-skill.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeSubSkillsCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";

export function DegreeModuleSkillController({
  pageId,
  formId,
  inputControllers = degreeSubSkillsCreationInputControllers,
  form,
  className = "grid gap-4",
}: Readonly<DegreeModuleSkillProps>) {
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
      API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
      API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
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
