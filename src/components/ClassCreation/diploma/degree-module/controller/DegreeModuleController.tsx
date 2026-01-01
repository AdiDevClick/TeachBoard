import type { DegreeModuleProps } from "@/components/ClassCreation/diploma/degree-module/types/degree-module.types";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithCommands } from "@/components/Popovers/PopoverField.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { degreeModuleCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
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
  className = "grid gap-4",
  formId,
  form,
}: Readonly<DegreeModuleProps>) {
  const {
    setRef,
    observedRefs,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
    submitCallback,
  } = useCommandHandler({
    form,
    pageId,
  });

  const queryClient = useQueryClient();
  const currentSkills =
    useWatch({
      control: form.control,
      name: "skillListDetails",
    }) || [];

  const resultsCallback = useCallback((keys: unknown[]) => {
    const cachedData = queryClient.getQueryData(keys ?? []);
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }
    if (cachedData === undefined) {
      return data;
    }
    return cachedData;
  }, []);

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = (variables: MutationVariables) => {
    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE,
      API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
    );
  };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, FETCH data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    openingCallback(open, metaData, inputControllers);
  };

  const handleCommandSelection = (
    value: string,
    commandItem: CommandItemType
  ) => {
    const currentSkills = new UniqueSet(
      null,
      form.getValues("skillListDetails") || []
    );
    if (currentSkills.has(value)) {
      currentSkills.delete(value);
    } else {
      currentSkills.set(value, commandItem);
    }
    form.setValue("skillList", Array.from(currentSkills.keys()), {
      shouldValidate: true,
    });

    form.setValue("skillListDetails", Array.from(currentSkills.entries()), {
      shouldValidate: true,
    });
  };

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={inputControllers.slice(0, 2)}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
      />
      <ControlledDynamicTagList
        form={form}
        setRef={setRef}
        {...inputControllers[2]}
        observedRefs={observedRefs}
        itemList={currentSkills}
      />
      <PopoverFieldWithCommands
        multiSelection
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
        {...inputControllers[2]}
      />
    </form>
  );
}
