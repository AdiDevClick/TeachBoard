import type {
  CommandItemType,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input";
import { PopoverFieldWithControllerAndCommandsList } from "@/components/Popovers/exports/popover-field.exports";
import { DynamicTags } from "@/components/Tags/DynamicTags";
import type { DynamicTagItemDetails } from "@/components/Tags/types/tags.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  commandSelectionDoesNotContainId,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { DEV_MODE, HTTP_METHODS, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { createDisabledGroup } from "@/features/class-creation/components/main/functions/class-creation.functions.ts";
import {
  createTaskTemplateView,
  updateValues,
} from "@/features/class-creation/components/TaskTemplateCreation/functions/task-template.functions.ts";
import type { TaskTemplateCreationFormSchema } from "@/features/class-creation/components/TaskTemplateCreation/models/class-task-template.models";
import type {
  TaskTemplateCreationControllerProps,
  TaskTemplateCreationDialogOptions,
} from "@/features/class-creation/components/TaskTemplateCreation/types/task-template-creation.types.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

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
  className,
  form,
  submitRoute = API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
  submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape,
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
    submitRoute,
    submitDataReshapeFn,
  });
  const queryClient = useQueryClient();
  const dialogData = dialogOptions(pageId) as
    | TaskTemplateCreationDialogOptions
    | undefined;

  const diplomaDatas = useMemo(() => {
    const selectedDiploma = dialogData?.selectedDiploma ?? null;
    const newTagSet = new UniqueSet<string, DynamicTagItemDetails>();

    const diplomaTag = selectedDiploma
      ? `${selectedDiploma?.degreeField} - ${selectedDiploma?.degreeLevel} ${selectedDiploma?.degreeYear}`
      : "Aucun diplôme sélectionné";
    newTagSet.set(diplomaTag, { id: diplomaTag });

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Selected diploma => : ", selectedDiploma);
    }

    return {
      diploma: selectedDiploma,
      shortTemplatesList: dialogData?.shortTemplatesList ?? [],
      tagData: Array.from(newTagSet.entries()),
    };
  }, [dialogData]);

  /**
   * Callback to reshape and retrieve cached data based on query keys.
   *
   * @param keys - The query keys used to retrieve cached data
   * @returns The reshaped cached data or the original data if not found
   */
  const isHeadingList = (value: unknown): value is HeadingType[] =>
    Array.isArray(value);

  const resolveCachedOrData = (cachedData: HeadingType[] | undefined) => {
    if (cachedData !== undefined) return cachedData;
    return isHeadingList(data) ? data : undefined;
  };

  const resultsCallback = (keys: string[]): HeadingType[] | undefined => {
    const cachedData = queryClient.getQueryData<HeadingType[]>(keys ?? []);
    if (!data && cachedData === undefined && keys[0] === "none") return;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.error("Cached data for ", keys, " is ", cachedData);
    }

    const currentDiplomaId = diplomaDatas.diploma?.id;
    const resolvedData = resolveCachedOrData(cachedData);

    if (!openedDialogs.includes(pageId) || !currentDiplomaId) {
      return resolvedData;
    }

    const isFetchedSkills = keys[0] === "new-task-module";
    const isFetchedTasks = keys[0] === "new-task-item";

    if (cachedData === undefined && !isFetchedSkills) {
      return resolvedData;
    }

    if (isFetchedSkills && diplomaDatas.diploma) {
      return createTaskTemplateView(diplomaDatas.diploma.modules);
    }

    if (isFetchedTasks) {
      if (!cachedData) {
        return resolvedData;
      }

      return createDisabledGroup({
        dataCopy: cachedData,
        cachedData,
        diplomaDatas,
      });
    }

    return cachedData;
  };

  const computedCommandHeadings = resultsCallback([
    fetchParams.contentId,
    fetchParams.url,
  ]);

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
   * Handle selection from command list
   *
   * @param value - Selected value
   * @param commandItemDetails - Details of the selected command item from the callback
   */
  const handleCommandSelection = (
    __value: string,
    commandItemDetails: CommandItemType,
  ) => {
    const isTask = Object.hasOwn(commandItemDetails, "description");
    if (isTask) {
      if (commandSelectionDoesNotContainId(commandItemDetails)) {
        debugLogs(
          `TaskTemplateCreationController Selected task item has no ID, selection ignored`,
          commandItemDetails,
        );
      }
      form.setValue("taskId", commandItemDetails.id, { shouldValidate: true });
      return;
    }

    const current = updateValues(
      commandItemDetails,
      form.getValues("skillsDuplicate"),
    );

    // Convenient copy - This is used to avoid rebuilding the original Map reference in the form values
    form.setValue("skillsDuplicate", Array.from(current), {
      shouldValidate: true,
    });

    // Update the actual skills field used for submission & validation
    form.setValue(
      "modules",
      Array.from(current.values()) as TaskTemplateCreationFormSchema["modules"],
      {
        shouldValidate: true,
      },
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

  const controllers = {
    inputsControllers: inputControllers.slice(0, 2),
    popoverFieldsControllers: inputControllers.slice(3, 5),
    dynamicTagsControllers: inputControllers[2],
  };

  return (
    <form
      id={formId}
      className={className}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ControlledInputList
        items={controllers.inputsControllers}
        form={form}
        setRef={setRef}
        observedRefs={observedRefs}
      />
      <DynamicTags
        {...controllers.dynamicTagsControllers}
        displayCRUD={false}
        itemList={diplomaDatas.tagData}
      />
      <PopoverFieldWithControllerAndCommandsList
        items={controllers.popoverFieldsControllers}
        form={form}
        setRef={setRef}
        onSelect={handleCommandSelection}
        onOpenChange={openingCallback}
        observedRefs={observedRefs}
        onAddNewItem={newItemCallback}
        commandHeadings={computedCommandHeadings}
      />
    </form>
  );
}
