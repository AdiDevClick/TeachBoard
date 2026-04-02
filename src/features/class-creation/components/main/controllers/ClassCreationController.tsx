import { AvatarsWithLabelAndAddButtonList } from "@/components/Form/exports/form.exports";
import { FormWithDebug } from "@/components/Form/FormWithDebug";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControlledCommands,
} from "@/components/Popovers/exports/popover-field.exports";
import { VerticalFieldSelectWithController } from "@/components/Selects/exports/vertical-field-select.exports";
import { NonLabelledGroupItemList } from "@/components/Selects/non-labelled-item/exports/non-labelled-item-exports";
import { ControlledDynamicTagList } from "@/components/Tags/exports/dynamic-tags.exports";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  classCreationControllerPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { CLASS_CREATION_INPUT_CONTROLLERS } from "@/features/class-creation/components/main/config/class-creation.configs";
import { yearsListRange } from "@/features/class-creation/components/main/functions/class-creation.functions.ts";
import { useClassCreationHandler } from "@/features/class-creation/components/main/hooks/useClassCreationHandler";
import { useDebouncedChecker } from "@/features/class-creation/components/main/hooks/useDebouncedChecker";
import type { ClassCreationControllerProps } from "@/features/class-creation/components/main/types/class-creation.types";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import { Activity, useMemo, type ChangeEvent } from "react";
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
 * @param submitRoute - The API endpoint for form submission
 * @param submitDataReshapeFn - The function to reshape data before submission
 */
export function ClassCreationController(props: ClassCreationControllerProps) {
  if (classCreationControllerPropsInvalid(props)) {
    debugLogs("ClassCreationController", { type: "propsValidation", props });
  }

  const {
    inputControllers = CLASS_CREATION_INPUT_CONTROLLERS,
    pageId,
    form,
    formId,
    className,
    submitRoute = API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
    submitDataReshapeFn = API_ENDPOINTS.POST.CREATE_CLASS.dataReshape,
  } = props;

  // End of defensive props check
  const {
    setRef,
    observedRefs,
    handleNewItem,
    resultsCallback,
    handleCommandSelection,
    invalidSubmitCallback,
    isSelectedDiploma,
    primaryTeacherMemo,
    studentsMemo,
    handleDeletingTask,
    handleValidSubmit,
    handleOnSelect,
    tasksValues,
    degreeConfigId,
    handleOpening,
  } = useClassCreationHandler({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });
  const { availabilityCheck } = useDebouncedChecker(form, 300);

  /**
   * Send a debouned API request to check for class name availability when the class name input changes.
   *
   * @param event - The change event from the class name input
   * @param meta - Optional metadata for the command handler, including API endpoint information
   */
  const handleClassNameChange = (
    event: ChangeEvent<HTMLInputElement>,
    meta?: CommandHandlerFieldMeta,
  ) => {
    const fieldName = meta?.name;

    if (fieldName !== "name" || !fieldName) {
      return;
    }

    availabilityCheck(event, {
      ...meta,
      searchParams: { filterBy: fieldName },
    });
  };

  const avatarControllers = [
    {
      ...inputControllers.avatar[0],
      items: studentsMemo,
    },
    {
      ...inputControllers.avatar[1],
      items: primaryTeacherMemo,
    },
  ];

  const sharedCallbacksMemo = useMemo(() => {
    const sharedCallbacks = {
      onOpenChange: handleOpening,
      onSelect: handleOnSelect,
      onClick: handleNewItem,
    };
    const commonObsProps = {
      setRef,
      observedRefs,
    };
    const all = {
      ...commonObsProps,
      ...sharedCallbacks,
    };

    return { sharedCallbacks, commonObsProps, all };
  }, [observedRefs, handleOnSelect, handleNewItem, handleOpening, setRef]);

  return (
    <FormWithDebug
      setRef={setRef}
      form={form}
      formId={formId}
      pageId={pageId}
      onValidSubmit={handleValidSubmit}
      className={className}
      onInvalidSubmit={invalidSubmitCallback}
    >
      <ControlledInputList
        control={form.control}
        items={inputControllers.inputs}
        setRef={setRef}
        onChange={handleClassNameChange}
      />
      <PopoverFieldWithControlledCommands
        {...inputControllers.popover}
        control={form.control}
        {...sharedCallbacksMemo.all}
        commandHeadings={resultsCallback()}
      />
      <AvatarsWithLabelAndAddButtonList
        items={avatarControllers}
        onClick={handleNewItem}
      />
      <Activity mode={isSelectedDiploma ? "visible" : "hidden"}>
        <ControlledDynamicTagList
          control={form.control}
          {...sharedCallbacksMemo.commonObsProps}
          {...inputControllers.dynamicList}
          itemList={tasksValues ?? []}
          onRemove={handleDeletingTask}
        />
        <PopoverFieldWithCommands
          {...sharedCallbacksMemo.all}
          {...inputControllers.dynamicList}
          onSelect={handleCommandSelection}
          resetKey={degreeConfigId}
          commandHeadings={resultsCallback()}
        />
      </Activity>
      <VerticalFieldSelectWithController
        {...sharedCallbacksMemo.commonObsProps}
        name="schoolYear"
        control={form.control}
        fullWidth={false}
        placeholder={"defaultSchoolYear"}
        defaultValue={defaultSchoolYear}
        label="Année scolaire"
        id={`${pageId}-schoolYear`}
      >
        <NonLabelledGroupItemList items={years} />
      </VerticalFieldSelectWithController>
    </FormWithDebug>
  );
}
