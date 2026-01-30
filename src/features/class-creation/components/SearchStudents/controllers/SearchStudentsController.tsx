import { CommandItemsForComboBox } from "@/components/Command/CommandItems.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import type { SearchStudentsControllerProps } from "@/features/class-creation/components/SearchStudents/types/search-students.types.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useCallback, useEffect } from "react";

/**
 * Controller for searching and selecting students.
 * @param pageId - The unique identifier for the page/component using this controller
 * @param form - The form object managing the state of selected students
 * @param selectedStudents - An object containing currently selected students
 * @param formId - The unique identifier for the form
 * @returns A SearchStudentsController component
 */
export function SearchStudentsController({
  pageId,
  form,
  localForm,
  className,
  formId,
}: SearchStudentsControllerProps) {
  const { closeDialog, openingCallback, resultsCallback, selectionCallback } =
    useCommandHandler({
      form,
      pageId,
    });

  /**
   * Handle item selection in the command component
   * Simply retrieve this object by calling `dialogOptions(pageId or "search-students")?.selectedStudents`
   *
   * @description Updates both the form state and dialog options to reflect the selected students
   *
   * @remarks This allows for multi-selection of students and keeps the form and dialog state in sync.
   *
   * @param value - The value of the selected command item
   * @param commandItemDetails - The details of the selected command item
   */
  const handleOnSelect = useCallback(
    (_value: string, commandItemDetails: CommandItemType) => {
      if (
        commandItemDetails.id === undefined ||
        commandItemDetails.id === null
      ) {
        if (DEV_MODE && !NO_CACHE_LOGS) {
          console.warn(
            "Selected command item has no ID, selection ignored:",
            commandItemDetails,
          );
        }
        return;
      }

      const newValue = commandItemDetails.id;
      const options = {
        mainFormField: "students",
        secondaryFormField: "studentsValues",
        detailedCommandItem: commandItemDetails,
      };
      selectionCallback(newValue, options);

      localForm.setValue("students", form?.getValues("students") || [], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [],
  );

  const handleSubmit = () => {
    closeDialog(null, pageId);
  };

  /**
   * Initial fetch setup
   *
   * @description Sets up the fetch parameters for retrieving students and triggers the fetch on component mount.
   */
  useEffect(() => {
    const metaData = {
      dataReshapeFn: API_ENDPOINTS.GET.STUDENTS.dataReshape,
      apiEndpoint: API_ENDPOINTS.GET.STUDENTS.endpoint,
      task: pageId,
      form,
    };

    openingCallback(true, metaData);
  }, []);

  return (
    <>
      <CommandItemsForComboBox
        avatarDisplay
        multiSelection
        onSelect={handleOnSelect}
        commandHeadings={resultsCallback()}
      />

      {/* Fix to avoid a focus effect */}
      <form
        id={formId}
        className={className}
        onSubmit={localForm.handleSubmit(handleSubmit)}
      />
    </>
  );
}
