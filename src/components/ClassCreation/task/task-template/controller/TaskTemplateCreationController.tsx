import {
  createTaskTemplateView,
  updateValues,
} from "@/components/ClassCreation/task/task-template/functions/task-template.functions.ts";
import type { TaskTemplateCreationControllerProps } from "@/components/ClassCreation/task/task-template/types/task-template-creation.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithControllerAndCommandsList } from "@/components/Popovers/PopoverField.tsx";
import { DynamicTag } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

/**
 * Controller component for creating task templates.
 *
 * @param pageId - The unique identifier for the page or component instance
 * @param formId - The unique identifier for the form
 * @param inputControllers - An array of input controller configurations
 * @param className - Additional CSS classes for styling the form
 * @param form - The react-hook-form instance managing the form state
 * @param diplomaDatas - Data related to the diploma associated with the task template
 */
export function TaskTemplateCreationController({
  pageId,
  formId,
  inputControllers,
  className = "grid gap-4",
  form,
  diplomaDatas,
}: Readonly<TaskTemplateCreationControllerProps>) {
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
  const savedSkills = useRef(null!);

  /**
   * Callback to reshape and retrieve cached data based on query keys.
   *
   * @param keys - The query keys used to retrieve cached data
   * @returns The reshaped cached data or the original data if not found
   */
  const resultsCallback = useCallback((keys: unknown[]) => {
    const cachedData = queryClient.getQueryData(keys ?? []);
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", keys, " is ", cachedData);
    }

    const isRetrievedSkills = keys[0] === "new-task-skill";

    if (cachedData === undefined && !isRetrievedSkills) {
      return data;
    }

    if (isRetrievedSkills && diplomaDatas) {
      if (!savedSkills.current) {
        const displayedSkills = createTaskTemplateView(diplomaDatas.skills);

        savedSkills.current = displayedSkills;

        return displayedSkills;
      }

      return savedSkills.current;
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
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape
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

  /**
   * Handle selection from command list
   *
   * @param value - Selected value
   * @param commandItemDetails - Details of the selected command item from the callback
   */
  const handleCommandSelection = (value: string, commandItemDetails) => {
    const isTask = Object.hasOwn(commandItemDetails, "description");
    if (isTask) {
      form.setValue("taskId", commandItemDetails.id, { shouldValidate: true });
      return;
    }

    const current = updateValues(
      commandItemDetails,
      form.getValues("skillsDuplicate")
    );

    // Convenient copy - This is used to avoid rebuilding the original Map reference in the form values
    form.setValue("skillsDuplicate", Array.from(current), {
      shouldValidate: true,
    });

    // Update the actual skills field used for submission & validation
    form.setValue("skills", Array.from(current.values()), {
      shouldValidate: true,
    });
  };


  if (form.getValues("degreeConfigId") !== diplomaDatas.id) {
    form.setValue("degreeConfigId", diplomaDatas.id, {
      shouldValidate: true,
    });
  }

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
        onOpenChange={handleOpening}
      />
      <DynamicTag
        {...inputControllers[2]}
        itemList={[
          `${diplomaDatas?.degreeField} - ${diplomaDatas?.degreeLevel} ${diplomaDatas?.degreeYear}`,
        ]}
      />
      <PopoverFieldWithControllerAndCommandsList
        items={inputControllers.slice(3, 5)}
        form={form}
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={handleOpening}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
      />
    </form>
  );
}
