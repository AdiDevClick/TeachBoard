import type { DegreeItemProps } from "@/components/ClassCreation/diploma/degree-item/types/degree-item.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import type { AppModalNames } from "@/configs/app.config.ts";
import { degreeCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDegreeCreation } from "@/hooks/useDegreeCreation.ts";

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
 * @param queryHooks - The query hooks for handling form submission and state.
 */
export function DegreeItemController({
  pageId = "new-degree-item",
  inputControllers = degreeCreationInputControllers,
  className = "grid gap-4",
  formId,
  form,
  queryHooks,
}: Readonly<DegreeItemProps>) {
  const { handleSubmit, setRef, observedRefs } = useDegreeCreation({
    queryHooks,
    form,
    hookOptions: {
      pageId: pageId as AppModalNames,
      inputControllers: inputControllers,
    },
  });

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
