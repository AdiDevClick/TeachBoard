import {
  resetSelectedItemsFromCache,
  saveKeys,
  yearsListRange,
} from "@/components/ClassCreation/functions/class-creation.functions.ts";
import type { ClassCreationControllerProps } from "@/components/ClassCreation/types/class-creation.types.ts";
import type {
  CommandItemType,
  DetailedCommandItem,
} from "@/components/Command/types/command.types.ts";
import { AvatarsWithLabelAndAddButtonList } from "@/components/Form/AvatarListWithLabelAndAddButton.tsx";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/PopoverField.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import { VerticalFieldSelectWithController } from "@/components/Selects/VerticalFieldSelect.tsx";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  debugLogs,
  taskModalPropsInvalid,
} from "@/configs/app-components.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { classCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import { useAvatarDataGenerator } from "@/hooks/useAvatarDataGenerator.ts";
import type { ClassCreationFormSchema } from "@/models/class-creation.models.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, useEffect, useRef, useState } from "react";
import { useWatch, type FieldErrors } from "react-hook-form";

const year = new Date().getFullYear();
const years = yearsListRange(year, 5);
const defaultSchoolYear = year + " - " + (year + 1);

/**
 * ClassCreationController Component
 *
 * @description This component handles the class creation form, including input management,
 * command handling, and form submission.
 *
 * @param inputControllers - The input controllers for the form
 * @param pageId - The unique identifier for the page
 * @param className - Additional class names for styling
 * @param form - The form object for managing form state
 * @param formId - The unique identifier for the form
 * @param props - Additional props
 */
export function ClassCreationController({
  inputControllers = classCreationInputControllers,
  pageId,
  form,
  formId,
  className,
}: ClassCreationControllerProps) {
  const [isSelectedDiploma, setIsSelectedDiploma] = useState(false);

  const queryClient = useQueryClient();
  const studentsMemo = useAvatarDataGenerator(form, "studentsValues");
  const primaryTeacherMemo = useAvatarDataGenerator(
    form,
    "primaryTeacherValue"
  );
  const tasksValues =
    useWatch({
      control: form.control,
      name: "tasksValues",
    }) ?? [];

  const {
    setRef,
    observedRefs,
    submitCallback,
    newItemCallback,
    openingCallback,
    openedDialogs,
    resultsCallback,
    selectionCallback,
  } = useCommandHandler({
    form,
    pageId,
  });

  const cachedKeysRef = useRef<Record<string, unknown[]>>({});
  const selectedDiplomaRef = useRef<CommandItemType | null>(null);

  /**
   * Handle modal close behavior
   *
   * @description Detects when the modal closes and resets the students & primary teacher selections  from the cache
   */
  useEffect(() => {
    const isModalOpen = openedDialogs.includes(pageId);

    if (isModalOpen) return;

    const currentStudentsValues = form.getValues("studentsValues") ?? [];
    const currentPrimaryTeacherValue =
      form.getValues("primaryTeacherValue") ?? [];

    if (currentStudentsValues.length > 0) {
      resetSelectedItemsFromCache(
        cachedKeysRef.current["search-students"],
        currentStudentsValues,
        queryClient
      );
    }

    if (currentPrimaryTeacherValue.length > 0) {
      resetSelectedItemsFromCache(
        cachedKeysRef.current["search-primaryteacher"],
        currentPrimaryTeacherValue,
        queryClient
      );
    }
  }, [openedDialogs]);

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, fetch data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (open: boolean, metaData?: Record<string, unknown>) => {
    const linkedDiploma = selectedDiplomaRef.current;
    const isNewTaskTemplate = metaData?.task === "new-task-template";

    if (isNewTaskTemplate && !taskModalPropsInvalid(linkedDiploma?.id)) {
      const message =
        "Tried to open task template modal without a selected diploma.";
      debugLogs("[ClassCreationController] - " + message);
      throw new Error(message);
    }

    if (isNewTaskTemplate && linkedDiploma) {
      metaData.apiEndpoint =
        API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
          linkedDiploma.id
        );
      metaData["degreeConfig"] = linkedDiploma;
    }

    openingCallback(open, metaData);
  };

  /**
   * Handle Class Creation form submission when form is valid
   *
   * @param variables - The form data to submit
   */
  const handleValidSubmit = (variables: ClassCreationFormSchema) => {
    const yearVariable = variables.schoolYear
      .split(" - ")
      .map((s) => s.trim())
      .join("-");
    variables.schoolYear = yearVariable;

    submitCallback(
      variables,
      API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
      API_ENDPOINTS.POST.CREATE_CLASS.dataReshape
    );
  };

  /**
   * Handle Class Creation form submission when there are validation errors
   *
   * @param errors - The validation errors
   */
  const handleInvalidSubmit = (
    errors: FieldErrors<ClassCreationFormSchema>
  ) => {
    if (DEV_MODE) {
      const currentValues = form.getValues() as ClassCreationFormSchema;
      (globalThis as any).__TB_CLASS_CREATION_LAST_INVALID_SUBMIT__ = {
        at: Date.now(),
        keys: Object.keys(errors ?? {}),
        values: {
          ...currentValues,
        },
      };

      if (!NO_CACHE_LOGS) {
        console.debug("ClassCreation invalid submit", errors);
      }
    }
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
    commandItemDetails: DetailedCommandItem
  ) => {
    const options = {
      mainFormField: "tasks",
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
   * Handle command selection from PopoverFieldWithControllerAndCommandsList
   *
   * @description Updates the selected diploma reference and selection state.
   *
   * @param value - The value of the selected command item
   * @param commandItem - The details of the selected command item
   */
  const handleOnSelect = (__value: string, commandItem: CommandItemType) => {
    if (form.watch("degreeConfigId") !== commandItem.id) {
      selectedDiplomaRef.current = commandItem;
      setIsSelectedDiploma(!!commandItem);
      form.setValue("degreeConfigId", commandItem.id, { shouldValidate: true });
      form.setValue("tasks", [], { shouldValidate: true });
      form.setValue("tasksValues", [], { shouldValidate: true });
    }
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
        selectedStudents: form.getValues("studentsValues"),
        selectedPrimaryTeacher: form.getValues("primaryTeacherValue"),
      });
    }
    const task = rest.task;
    rest.form = form;

    if (task === "search-students") {
      rest.selectedStudents = form.getValues("studentsValues") ?? {};
    }

    if (task === "search-primaryteacher") {
      rest.selectedPrimaryTeacher = form.getValues("primaryTeacherValue") ?? {};
    }

    if (task === "new-task-template" && selectedDiplomaRef.current) {
      rest.apiEndpoint =
        API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
          selectedDiplomaRef.current.id
        );
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

  const handleOnYearSelect = (value: string) => {
    if (form.watch("schoolYear") !== value) {
      form.setValue("schoolYear", value, { shouldValidate: true });
    }
  };

  const handleDeletingTask = (
    taskValue: string,
    taskDetails?: Record<string, unknown>
  ) => {
    const tasks = new Set(form.getValues("tasks") || []);
    const tasksValues = new Set(form.getValues("tasksValues") || []);
    tasksValues.delete(taskValue);
    form.setValue("tasksValues", Array.from(tasksValues), {
      shouldValidate: true,
    });
    form.setValue("tasks", Array.from(tasks), { shouldValidate: true });
  };

  const controllers = {
    dynamicListControllers: inputControllers[2],
    controlledInputsControllers: inputControllers.slice(0, 2),
    popoverControllers: inputControllers.slice(3, 4),
    avatarControllers: [
      {
        ...inputControllers[4],
        items: studentsMemo,
      },
      {
        ...inputControllers[5],
        items: primaryTeacherMemo,
      },
    ],
  };
  return (
    <form
      ref={(el) => setRef(el, { name: pageId, formId })}
      id={formId}
      onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)}
      className={className}
    >
      <ControlledInputList
        items={controllers.controlledInputsControllers}
        form={form}
        setRef={setRef}
      />
      <PopoverFieldWithControllerAndCommandsList
        items={controllers.popoverControllers}
        form={form}
        setRef={setRef}
        commandHeadings={resultsCallback()}
        observedRefs={observedRefs}
        onOpenChange={handleOpening}
        onSelect={handleOnSelect}
        onAddNewItem={handleNewItem}
      />
      <AvatarsWithLabelAndAddButtonList
        items={controllers.avatarControllers}
        type="button"
        onClick={handleNewItem}
      />
      <Activity mode={isSelectedDiploma ? "visible" : "hidden"}>
        <ControlledDynamicTagList
          form={form}
          setRef={setRef}
          {...controllers.dynamicListControllers}
          observedRefs={observedRefs}
          itemList={tasksValues}
          // onRemove={handleCommandSelection}
          onRemove={handleDeletingTask}
        />
        <PopoverFieldWithCommands
          multiSelection
          setRef={setRef}
          onSelect={handleCommandSelection}
          onOpenChange={handleOpening}
          observedRefs={observedRefs}
          onAddNewItem={handleNewItem}
          resetKey={form.watch("degreeConfigId")}
          commandHeadings={resultsCallback()}
          {...controllers.dynamicListControllers}
        />
      </Activity>
      <VerticalFieldSelectWithController
        setRef={setRef}
        observedRefs={observedRefs}
        name="schoolYear"
        form={form}
        fullWidth={false}
        placeholder={"defaultSchoolYear"}
        defaultValue={defaultSchoolYear}
        label="Année scolaire"
        id={`${pageId}-schoolYear`}
        onValueChange={handleOnYearSelect}
      >
        <ListMapper items={years}>
          <NonLabelledGroupItem />
        </ListMapper>
      </VerticalFieldSelectWithController>
    </form>
  );
}
