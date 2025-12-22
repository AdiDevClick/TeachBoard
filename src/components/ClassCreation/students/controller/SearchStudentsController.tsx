import type { SearchStudentsControllerProps } from "@/components/ClassCreation/students/types/search-students.types.ts";
import { CommandItemsForComboBox } from "@/components/Command/CommandItems.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

/**
 * Controller for searching and selecting students.
 * @param pageId - The unique identifier for the page/component using this controller
 * @param form - The form object managing the state of selected students
 * @returns A SearchStudentsController component
 */
export function SearchStudentsController({
  pageId,
  form,
}: Readonly<SearchStudentsControllerProps>) {
  const {
    setFetchParams,
    data,
    fetchParams,
    error,
    isLoaded,
    isLoading,
    onSubmit,
  } = useFetch();
  const { dialogOptions, setDialogOptions } = useDialog();
  const queryClient = useQueryClient();

  /**
   * Retrieve results from cache or fetched data
   *
   * @description Checks React Query cache for existing data before falling back to fetched data.
   */
  const resultsCallback = useCallback((keys: any) => {
    // saveKeys(keys, cachedKeysRef);
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
      console.log(value, commandItemDetails);

      const studentId = commandItemDetails.id;
      const studentName =
        commandItemDetails.firstName + " " + commandItemDetails.lastName;

      const localFormStudents = new Set(form.watch("students") || []);
      const savedStudents = dialogOptions(pageId)?.selectedStudents || {};

      if (localFormStudents.has(studentId)) {
        localFormStudents.delete(studentId);
        delete savedStudents[studentName];
      } else {
        localFormStudents.add(studentId);
        savedStudents[studentName] = commandItemDetails;
      }

      form.setValue("students", Array.from(localFormStudents), {
        shouldValidate: true,
      });

      setDialogOptions(pageId, {
        ...dialogOptions(pageId),
        // Full details for further use
        selectedStudents: savedStudents,
        // Convenient for further filtering without touching the form values
        searchState: localFormStudents,
      });
    },
    []
  );

  /**
   * Initial fetch setup
   *
   * @description Sets up the fetch parameters for retrieving students and triggers the fetch on component mount.
   */
  useEffect(() => {
    setFetchParams((prev) => ({
      ...prev,
      dataReshapeFn: API_ENDPOINTS.GET.STUDENTS.dataReshape,
      url: API_ENDPOINTS.GET.STUDENTS.endpoint,
      contentId: pageId,
    }));

    onSubmit();
  }, []);

  return (
    <CommandItemsForComboBox
      avatarDisplay
      multiSelection
      onSelect={handleOnSelect}
      commandHeadings={resultsCallback([
        fetchParams.contentId,
        fetchParams.url,
      ])}
    />
  );
}
