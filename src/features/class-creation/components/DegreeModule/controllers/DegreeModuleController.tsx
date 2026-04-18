import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import { PopoverFieldWithCommands } from "@/components/Popovers/exports/popover-field.exports";
import { ControlledDynamicTagList } from "@/components/Tags/exports/dynamic-tags.exports";
import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { HTTP_METHODS } from "@/configs/app.config.ts";
import { degreeModuleCreationInputControllers } from "@/features/class-creation/components/DegreeModule/forms/degree-module-inputs";
import type { DegreeModuleControllerProps } from "@/features/class-creation/components/DegreeModule/types/degree-module.types.ts";
import { useDebouncedChecker } from "@/features/class-creation/components/main/hooks/useDebouncedChecker";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import { useMemo, type ChangeEvent } from "react";
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

  const { availabilityCheck } = useDebouncedChecker(form, 300);

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
      successDescription(success) {
        return {
          type: "success",
          descriptionMessage: `Le module "${success?.data?.code}" a été créé avec succès.`,
        };
      },
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
    selectionCallback(
      value,
      options as Parameters<typeof selectionCallback>[1],
    );
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

  // split the array elements so we can omit the `id` when sending props to
  // <PopoverFieldWithCommands>, which requires a branded UUID type.
  const controllers = {
    controlledInputsControllers: inputControllers.slice(0, 2),
    dynamicTagsController: inputControllers[2],
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
        items={controllers.controlledInputsControllers}
        control={form.control}
        onChange={handleValueChange}
      />
      <ControlledDynamicTagList
        control={form.control}
        {...controllers.dynamicTagsController}
        {...sharedCallbacksMemo.commonObsProps}
        itemList={currentSkills as DynamicTagsItemList}
      />
      <PopoverFieldWithCommands
        multiSelection
        onSelect={handleCommandSelection}
        onOpenChange={openingCallback}
        onClick={newItemCallback}
        commandHeadings={resultsCallback()}
        {...controllers.dynamicTagsController}
      />
    </form>
  );
}
