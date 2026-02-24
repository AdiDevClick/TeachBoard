import type { CommandItemType } from "@/components/Command/types/command.types";
import {
  debugLogs,
  taskModalPropsInvalid,
} from "@/configs/app-components.config";
import { DEV_MODE, HTTP_METHODS, NO_CACHE_LOGS } from "@/configs/app.config";
import {
  resetSelectedItemsFromCache,
  saveKeys,
  type ClassCreationFormSchema,
  type UseClassCreationHandlerProps,
} from "@/features/class-creation";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type {
  CommandHandlerFieldMeta,
  HandleAddNewItemParams,
} from "@/hooks/database/types/use-command-handler.types";
import { useAvatarDataGenerator } from "@/hooks/useAvatarDataGenerator";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useRef, useState } from "react";

/**
 * Custom hook to manage the logic for the ClassCreationController component, including command handling, form submission, and state management.
 *
 * @param form - The react-hook-form instance managing the form state
 * @param pageId - The unique identifier for the page, used for command handling context
 * @param submitRoute - The API endpoint for form submission
 * @param submitDataReshapeFn - The function to reshape data before submission
 */
export function useClassCreationHandler({
  form,
  pageId,
  submitRoute,
  submitDataReshapeFn,
}: UseClassCreationHandlerProps) {
  const {
    setRef,
    observedRefs,
    submitCallback,
    newItemCallback,
    openingCallback,
    openedDialogs,
    resultsCallback,
    selectionCallback,
    invalidSubmitCallback,
  } = useCommandHandler({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  const [isSelectedDiploma, setIsSelectedDiploma] = useState(false);
  const queryClient = useQueryClient();

  const cachedKeysRef = useRef<Record<string, unknown[]>>({});
  const selectedDiplomaRef = useRef<CommandItemType>(null);

  const studentsMemo = useAvatarDataGenerator(form, "studentsValues");
  const primaryTeacherMemo = useAvatarDataGenerator(
    form,
    "primaryTeacherValue",
  );

  const tasksValues = form.watch("tasksValues") ?? [];
  const degreeConfigId = form.watch("degreeConfigId");
  const studentsValues = form.watch("studentsValues") ?? [];
  const primaryTeacherValue = form.watch("primaryTeacherValue") ?? {};

  /**
   * Handle Class Creation form submission when form is valid
   *
   * @param variables - The form data to submit
   */
  const handleValidSubmit = (variables: ClassCreationFormSchema) => {
    submitCallback(variables, {
      method: HTTP_METHODS.POST,
    });
  };

  /**
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleOnSelect = (_value: string, commandItem: CommandItemType) => {
    if (degreeConfigId !== commandItem.id) {
      selectedDiplomaRef.current = commandItem;
      setIsSelectedDiploma(Boolean(commandItem));

      form.setValue("degreeConfigId", commandItem.id, {
        shouldValidate: true,
      });
      form.setValue("tasks", [], { shouldValidate: true });
      form.setValue("tasksValues", [], { shouldValidate: true });
    }
  };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: CommandHandlerFieldMeta) => {
    const linkedDiploma = selectedDiplomaRef.current;
    const isNewTaskTemplate = metaData?.task === "new-task-template";

    let newMetas = metaData;

    if (isNewTaskTemplate) {
      if (!linkedDiploma || taskModalPropsInvalid(linkedDiploma)) {
        const message =
          "Tried to open task template modal without a selected diploma.";
        debugLogs("[ClassCreationController] - " + message);
        throw new Error(message);
      }

      const computedApiEndpoint =
        typeof metaData.apiEndpoint === "function"
          ? metaData.apiEndpoint(linkedDiploma.id)
          : metaData.apiEndpoint;

      newMetas = {
        ...metaData,
        apiEndpoint: computedApiEndpoint,
        degreeConfig: linkedDiploma,
      };
    }

    openingCallback(open, newMetas);
  };
  /**
   * Handle adding a new item
   *
   * @param e - The event triggering the new item addition
   * @param rest - Additional parameters related to the new item
   */
  const handleNewItem = ({ e, ...rest }: HandleAddNewItemParams) => {
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Add new item triggered", {
        apiEndpoint: rest.apiEndpoint,
        task: rest.task,
        selectedDiploma: selectedDiplomaRef.current,
        selectedStudents: studentsValues,
        selectedPrimaryTeacher: primaryTeacherValue,
      });
    }
    const task = rest.task;
    rest.form = form;

    if (task === "search-students") {
      rest.selectedStudents = studentsValues ?? {};
    }

    if (task === "search-primaryteacher") {
      rest.selectedPrimaryTeacher = primaryTeacherValue ?? {};
    }

    if (task === "new-task-template" && selectedDiplomaRef.current) {
      rest.apiEndpoint =
        typeof rest.apiEndpoint === "function"
          ? rest.apiEndpoint(selectedDiplomaRef.current.id)
          : rest.apiEndpoint;
      rest.selectedDiploma = selectedDiplomaRef.current;

      const cached = queryClient.getQueryData([task, rest.apiEndpoint]);

      let data;
      if (Array.isArray(cached)) {
        data = cached[0];
      }

      rest.shortTemplatesList = data?.shortTemplatesList ?? [];
    }
    saveKeys([task, rest.apiEndpoint], cachedKeysRef);

    newItemCallback({
      e,
      ...rest,
    });
  };
  /**
   * Handle command selection from PopoverFieldWithCommands
   * @description Updates the form values based on selected command items.
   *
   * @param value - The value of the selected command item
   * @param commandItemDetails - The details of the selected command item
   */
  const handleCommandSelection = (
    value: string,
    commandItemDetails: CommandItemType,
  ) => {
    const options = {
      mainFormField: "tasks" as const,
      detailedCommandItem: commandItemDetails,
    };

    const newValue = commandItemDetails.id;
    selectionCallback(newValue, options);

    const otherOptions = {
      secondaryFormField: "tasksValues",
      detailedCommandItem: commandItemDetails,
    };

    selectionCallback(value, otherOptions);
  };
  /**
   * Handle deleting a task from the selected tasks list
   *
   * @param taskValue - The value of the task to delete
   */
  const handleDeletingTask = (taskValue: string) => {
    const tasks = new Set(form.getValues("tasks") || []);
    tasks.delete(taskValue);

    const nextTasksValues = tasksValues.filter(([key]) => key !== taskValue);

    form.setValue("tasksValues", nextTasksValues, {
      shouldValidate: true,
    });
    form.setValue("tasks", Array.from(tasks), { shouldValidate: true });
  };

  /**
   * DIALOG CACHE -
   *
   * @description Detects when the modal closes and resets the students & primary teacher selections from the cache
   */
  const resetDialogCache = useEffectEvent(() => {
    const isModalOpen = openedDialogs.includes(pageId);

    if (isModalOpen) return;

    if (studentsValues.length > 0) {
      resetSelectedItemsFromCache(
        cachedKeysRef.current["search-students"],
        studentsValues,
        queryClient,
      );
    }

    if (primaryTeacherValue.length > 0) {
      resetSelectedItemsFromCache(
        cachedKeysRef.current["search-primaryteacher"],
        primaryTeacherValue,
        queryClient,
      );
    }
  });

  /**
   * DIALOG CACHE - Handle modal close behavior
   *
   * @description Each time a dialog opens
   */
  useEffect(() => {
    resetDialogCache();
  }, [openedDialogs]);

  return {
    setRef,
    observedRefs,
    resultsCallback,
    invalidSubmitCallback,
    isSelectedDiploma,
    handleDeletingTask,
    handleOpening,
    studentsMemo,
    primaryTeacherMemo,
    handleValidSubmit,
    handleOnSelect,
    handleNewItem,
    cachedKeysRef,
    tasksValues,
    degreeConfigId,
    handleCommandSelection,
  };
}
