import type { ClasseNameAvailabilityResponse } from "@/api/types/routes/classes.types";
import { AvatarsWithLabelAndAddButtonList } from "@/components/Form/exports/form.exports";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input";
import {
  PopoverFieldWithCommands,
  PopoverFieldWithControllerAndCommandsList,
} from "@/components/Popovers/exports/popover-field.exports";
import { VerticalFieldSelectWithController } from "@/components/Selects/exports/vertical-field-select.exports";
import { NonLabelledGroupItemList } from "@/components/Selects/non-labelled-item/exports/non-labelled-item-exports";
import { ControlledDynamicTagList } from "@/components/Tags/exports/dynamic-tags.exports";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  classCreationControllerPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { yearsListRange } from "@/features/class-creation/components/main/functions/class-creation.functions.ts";
import { useClassCreationHandler } from "@/features/class-creation/components/main/hooks/useClassCreationHandler";
import type { ClassCreationControllerProps } from "@/features/class-creation/index.ts";
import { classCreationInputControllers } from "@/features/class-creation/index.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import { useFetch } from "@/hooks/database/fetches/useFetch";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import useDebounce from "@/hooks/useDebounce";
import { Activity, useEffect, useMemo, type ChangeEvent } from "react";

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
    debugLogs("ClassCreationController", props);
  }

  const {
    inputControllers = classCreationInputControllers,
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

  const { data, error, fetchParams, setFetchParams, onSubmit } = useFetch();

  /**
   * Handle changes to the class name input, including debounced API calls to check for name availability.
   *
   * @param event - The change event from the class name input
   * @param meta - Optional metadata for the command handler, including API endpoint information
   */
  const debouncedClassNameAvailabilityCheck = useDebounce(
    (rawValue: string, meta?: CommandHandlerFieldMeta) => {
      if (meta?.name !== "name" || !meta.apiEndpoint) return;

      const value = rawValue.trim();
      if (!value) return;

      const computedApiEndpoint =
        typeof meta.apiEndpoint === "function"
          ? meta.apiEndpoint(value)
          : meta.apiEndpoint;

      setFetchParams((prev) => ({
        ...prev,
        url: String(computedApiEndpoint),
        method: "GET",
        contentId: meta.task as FetchParams["contentId"],
        dataReshapeFn: meta.dataReshapeFn,
        silent: true,
      }));
    },
    300,
  );

  /**
   * TRIGGER CLASS NAME AVAILABILITY CHECK
   *
   * @description Every time a user types in the class name input
   */
  useEffect(() => {
    const url = fetchParams.url;

    if (!url) return;
    onSubmit();
  }, [fetchParams.url]);

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
    debouncedClassNameAvailabilityCheck(event.target.value, meta);
  };

  /**
   * Effect to handle API response for class name availability check, setting form errors if the name is already taken.
   */
  useEffect(() => {
    const availableFlag =
      error?.data?.available ??
      (data?.available as ClasseNameAvailabilityResponse);

    if (availableFlag === false) {
      form.setError("name", {
        type: "manual",
        message:
          "Ce nom de classe est déjà utilisé. Veuillez en choisir un autre.",
      });
    } else {
      form.clearErrors("name");
    }
  }, [error, form, data]);

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
  const sharedCallbacksMemo = useMemo(() => {
    const sharedCallbacks = {
      onOpenChange: handleOpening,
      onSelect: handleOnSelect,
      onAddNewItem: handleNewItem,
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
    <form
      ref={(el) => setRef(el, { name: pageId, formId })}
      id={formId}
      onSubmit={form.handleSubmit(handleValidSubmit, invalidSubmitCallback)}
      className={className}
    >
      <ControlledInputList
        form={form}
        items={controllers.controlledInputsControllers}
        setRef={setRef}
        onChange={handleClassNameChange}
      />
      <PopoverFieldWithControllerAndCommandsList
        items={controllers.popoverControllers}
        form={form}
        {...sharedCallbacksMemo.all}
        commandHeadings={resultsCallback()}
      />
      <AvatarsWithLabelAndAddButtonList
        items={controllers.avatarControllers}
        type="button"
        onClick={handleNewItem}
      />
      <Activity mode={isSelectedDiploma ? "visible" : "hidden"}>
        <ControlledDynamicTagList
          form={form}
          {...sharedCallbacksMemo.commonObsProps}
          {...controllers.dynamicListControllers}
          itemList={tasksValues}
          onRemove={handleDeletingTask}
        />
        <PopoverFieldWithCommands
          multiSelection
          {...sharedCallbacksMemo.all}
          onSelect={handleCommandSelection}
          resetKey={degreeConfigId}
          commandHeadings={resultsCallback()}
          {...controllers.dynamicListControllers}
        />
      </Activity>
      <VerticalFieldSelectWithController
        {...sharedCallbacksMemo.commonObsProps}
        name="schoolYear"
        form={form}
        fullWidth={false}
        placeholder={"defaultSchoolYear"}
        defaultValue={defaultSchoolYear}
        label="Année scolaire"
        id={`${pageId}-schoolYear`}
      >
        <NonLabelledGroupItemList items={years} />
      </VerticalFieldSelectWithController>
    </form>
  );
}
