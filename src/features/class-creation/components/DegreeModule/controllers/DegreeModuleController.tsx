import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { HTTP_METHODS } from "@/configs/app.config.ts";
import { degreeModuleCreationInputControllers } from "@/features/class-creation/components/DegreeModule/forms/degree-module-inputs";
import type { DegreeModuleControllerProps } from "@/features/class-creation/components/DegreeModule/types/degree-module.types.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

/**
 * Controller component for creating a new degree skill.
 *
 * !! IMPORTANT !! Be sure that the inputControllers passed to this component are already validated by Zod Schema.
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param form - The react-hook-form instance.
 * @param className - Additional CSS classes for styling.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 */
export function DegreeModuleController({
  pageId = "new-degree-module",
  inputControllers = degreeModuleCreationInputControllers,
  className,
  formId,
  form,
  submitRoute = API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE,
  submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_SKILL.dataReshape,
}: DegreeModuleControllerProps) {
  const {
    setRef,
    observedRefs,
    newItemCallback,
    openingCallback,
    submitCallback,
    resultsCallback,
    selectionCallback,
  } = useCommandHandler({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  const currentSkills =
    useWatch({
      control: form.control,
      name: "skillListDetails" as never,
    }) || [];

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
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected skill list and selection state.
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleCommandSelection = (
    value: string,
    commandItem: CommandItemType,
  ) => {
    const options = {
      mainFormField: "skillList",
      secondaryFormField: "skillListDetails",
      detailedCommandItem: commandItem,
    };
    selectionCallback(value, options);
  };

  const controllers = {
    dynamicTagsList: inputControllers[2],
    controlledInputsList: inputControllers.slice(0, 2),
  };

  const sharedCallbacksMemo = useMemo(() => {
    const commonObsProps = {
      setRef,
      observedRefs,
    };
    return { commonObsProps };
  }, [setRef, observedRefs]);

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        {...sharedCallbacksMemo.commonObsProps}
        items={controllers.controlledInputsList}
        form={form}
      />
      <ControlledDynamicTagList
        form={form}
        {...controllers.dynamicTagsList}
        {...sharedCallbacksMemo.commonObsProps}
        itemList={currentSkills}
      />
      <PopoverFieldWithCommands
        multiSelection
        {...sharedCallbacksMemo.commonObsProps}
        onSelect={handleCommandSelection}
        onOpenChange={openingCallback}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback()}
        {...controllers.dynamicTagsList}
      />
    </form>
  );
}
