import type { SearchStudentsControllerProps } from "@/components/ClassCreation/students/types/search-students.types.ts";
import { CommandItemsForComboBox } from "@/components/Command/CommandItems.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useQueryClient } from "@tanstack/react-query";
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
  selectedStudents,
  formId,
}: Readonly<SearchStudentsControllerProps>) {
  const { fetchParams, data, closeDialog, openingCallback } = useCommandHandler(
    {
      form: localForm,
      pageId,
    }
  );

  const queryClient = useQueryClient();

  /**
   * Retrieve results from cache or fetched data
   *
   * @description Checks React Query cache for existing data before falling back to fetched data.
   */
  const resultsCallback = useCallback((keys: any) => {
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
    (value: string, commandItemDetails: CommandItemType) => {
      const studentId = commandItemDetails.id;
      const studentName =
        commandItemDetails.firstName + " " + commandItemDetails.lastName;
      const isSelected = commandItemDetails.isSelected;

      if (studentId === undefined) return;

      const studentsFormIds = new Set(form.watch("students") || []);

      // if (!isSelected) {
      if (studentsFormIds.has(studentId) || !isSelected) {
        studentsFormIds.delete(studentId);
        delete selectedStudents[studentName];
      } else {
        studentsFormIds.add(studentId);
        selectedStudents[studentName] = commandItemDetails;
      }
      // Modify local form to trigger reactivity
      localForm.setValue("students", Array.from(studentsFormIds), {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Modify main form to store final values and allow details retrieval to allow avatar display in the class creation component
      form.setValue("students", Array.from(studentsFormIds), {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.setValue("studentsValues",selectedStudents, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    []
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
    const metaData = {};
    metaData.dataReshapeFn = API_ENDPOINTS.GET.STUDENTS.dataReshape;
    metaData.apiEndpoint = API_ENDPOINTS.GET.STUDENTS.endpoint;
    metaData.task = pageId;
    metaData.form = form;

    openingCallback(true, metaData, null);
  }, []);

  return (
    <>
      <CommandItemsForComboBox
        avatarDisplay
        multiSelection
        onSelect={handleOnSelect}
        commandHeadings={resultsCallback([
          fetchParams.contentId,
          fetchParams.url,
        ])}
      />

      {/* Fix to avoid a focus effect */}
      <form
        id={formId}
        className="display-none"
        onSubmit={localForm.handleSubmit(handleSubmit)}
      />
    </>
  );
}
