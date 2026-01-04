import type { UUID } from "@/api/types/openapi/common.types.ts";

import {
  createDisabledGroup,
  handleDiplomaChange,
} from "@/components/ClassCreation/functions/class-creation.functions.ts";
import {
  createTaskTemplateView,
  fetchSkillsData,
  fetchTasksData,
  updateValues,
} from "@/components/ClassCreation/task/task-template/functions/task-template.functions.ts";
import type { TaskTemplateCreationControllerProps } from "@/components/ClassCreation/task/task-template/types/task-template-creation.types.ts";
import type {
  DetailedCommandItem,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { PopoverFieldWithControllerAndCommandsList } from "@/components/Popovers/PopoverField.tsx";
import { DynamicTag } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  commandSelectionDoesNotContainId,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type { TaskTemplateCreationFormSchema } from "@/models/class-task-template.models.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";

/**
 * Controller component for creating task templates.
 *
 * @param pageId - The unique identifier for the page or component instance
 * @param formId - The unique identifier for the form
 * @param inputControllers - An array of input controller configurations
 * @param className - Additional CSS classes for styling the form
 * @param form - The react-hook-form instance managing the form state
 */
export function TaskTemplateCreationController({
  pageId,
  formId,
  inputControllers = [],
  className = "grid gap-4",
  form,
}: TaskTemplateCreationControllerProps) {
  const {
    setRef,
    observedRefs,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
    submitCallback,
    dialogOptions,
    openedDialogs,
  } = useCommandHandler({
    form,
    pageId,
  });
  const queryClient = useQueryClient();
  const savedSkills = useRef<ReturnType<typeof createTaskTemplateView>>(null!);
  const dialogData = dialogOptions(pageId);
  const diplomaDatas = useMemo(() => {
    const selectedDiploma = dialogData?.selectedDiploma ?? null;
    const newTagSet = new UniqueSet();
    const diplomaTag = selectedDiploma
      ? `${selectedDiploma?.degreeField} - ${selectedDiploma?.degreeLevel} ${selectedDiploma?.degreeYear}`
      : "Aucun diplôme sélectionné";
    newTagSet.set(diplomaTag, []);

    return {
      diploma: selectedDiploma,
      shortTemplatesList: dialogData?.shortTemplatesList ?? [],
      tagData: Array.from(newTagSet.entries()),
    };
  }, [dialogData]);

  const itemToDisplay = useRef<ReturnType<typeof createDisabledGroup>>(null!);
  const activeDiplomaIdRef = useRef<UUID>(null!);

  /**
   * Callback to reshape and retrieve cached data based on query keys.
   *
   * @param keys - The query keys used to retrieve cached data
   * @returns The reshaped cached data or the original data if not found
   */
  const resultsCallback = useCallback(
    (keys: string[]) => {
      const cachedData = queryClient.getQueryData<HeadingType[]>(keys ?? []);
      if (!data && cachedData === undefined && keys[0] === "none") return;
      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.log("Cached data for ", keys, " is ", cachedData);
      }

      if (!openedDialogs.includes(pageId)) {
        return cachedData ?? data;
      }

      const isFetchedSkills = keys[0] === "new-task-skill";
      const isFetchedTasks = keys[0] === "new-task-item";
      const currentDiplomaId = diplomaDatas.diploma?.id;

      const isDiplomaChanged = handleDiplomaChange({
        currentId: currentDiplomaId,
        activeDiplomaIdRef,
        savedSkills,
        itemToDisplay,
      });

      if (cachedData === undefined && !isFetchedSkills) {
        return data;
      }

      if (isFetchedSkills) {
        return fetchSkillsData(diplomaDatas.diploma, savedSkills);
      }

      if (isFetchedTasks) {
        if (cachedData === undefined) {
          return data;
        }
        return fetchTasksData(
          cachedData,
          diplomaDatas,
          currentDiplomaId,
          isDiplomaChanged,
          itemToDisplay,
          activeDiplomaIdRef
        );
      }

      return cachedData;
    },
    [data, diplomaDatas, openedDialogs, pageId, queryClient]
  );

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
   * Handle selection from command list
   *
   * @param value - Selected value
   * @param commandItemDetails - Details of the selected command item from the callback
   */
  const handleCommandSelection = (
    __value: string,
    commandItemDetails: DetailedCommandItem
  ) => {
    const isTask = Object.hasOwn(commandItemDetails, "description");
    if (isTask) {
      if (!commandSelectionDoesNotContainId(commandItemDetails)) {
        debugLogs(
          `TaskTemplateCreationController Selected task item has no ID, selection ignored`,
          commandItemDetails
        );
        return;
      }
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
    form.setValue(
      "skills",
      Array.from(current.values()) as TaskTemplateCreationFormSchema["skills"],
      {
        shouldValidate: true,
      }
    );
  };

  if (
    diplomaDatas.diploma?.id &&
    form.getValues("degreeConfigId") !== diplomaDatas.diploma.id
  ) {
    form.setValue("degreeConfigId", diplomaDatas.diploma.id, {
      shouldValidate: true,
    });
  }

  const controllerInputsControllers = inputControllers.slice(0, 2);
  const popoverFieldsControllers = inputControllers.slice(3, 5);
  const dynamicTagsControllers = inputControllers[2];

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={controllerInputsControllers}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
        onOpenChange={openingCallback}
      />
      <DynamicTag {...dynamicTagsControllers} itemList={diplomaDatas.tagData} />
      <PopoverFieldWithControllerAndCommandsList
        items={popoverFieldsControllers}
        form={form}
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={openingCallback}
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
