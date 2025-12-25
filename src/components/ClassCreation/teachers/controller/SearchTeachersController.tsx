import { resetSelectedItemsFromCache } from "@/components/ClassCreation/functions/class-creation.functions.ts";
import type { SearchPrimaryTeacherControllerProps } from "@/components/ClassCreation/teachers/types/search-teachers.types.ts";
import { CommandItemsForComboBox } from "@/components/Command/CommandItems.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

/**
 * Controller for searching and selecting primary teachers.
 *
 * @param pageId - The unique identifier for the page/component using this controller
 * @param form - The form object managing the state of selected primary teacher
 * @param selectedPrimaryTeacher - An object containing currently selected primary teacher
 * @param formId - The unique identifier for the form
 * @returns A SearchPrimaryTeacherController component
 */
export function SearchPrimaryTeacherController({
  pageId,
  form,
  localForm,
  selectedPrimaryTeacher,
  formId,
}: Readonly<SearchPrimaryTeacherControllerProps>) {
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
   * Simply retrieve this object by calling `dialogOptions(pageId or "search-primaryteacher")?.selectedPrimaryTeacher`
   *
   * @description Updates both the form state and dialog options to reflect the selected primary teacher
   *
   * @remarks This allows for single-selection of primary teacher and keeps the form and dialog state in sync.
   * When a new teacher is selected, the previous one is automatically deselected in the cache.
   *
   * @param value - The value of the selected command item
   * @param commandItemDetails - The details of the selected command item
   */
  const handleOnSelect = useCallback(
    (value: string, commandItemDetails: CommandItemType) => {
      const teacherId = commandItemDetails.id;
      const teacherName =
        commandItemDetails.firstName + " " + commandItemDetails.lastName;
      const isSelected = commandItemDetails.isSelected;

      if (teacherId === undefined) return;

      const currentTeacherId = form.watch("primaryTeacherId");

      // Deselect the previous teacher in cache if there was one
      if (currentTeacherId && currentTeacherId !== teacherId) {
        resetSelectedItemsFromCache(
          ["search-primaryteacher", API_ENDPOINTS.GET.TEACHERS.endpoint],
          selectedPrimaryTeacher,
          queryClient
        );
      }

      let teachersFormIds = "";

      // Clear the selectedPrimaryTeacher object to ensure only one teacher is selected
      Object.keys(selectedPrimaryTeacher).forEach((key) => {
        delete selectedPrimaryTeacher[key];
      });

      if (currentTeacherId === teacherId || !isSelected) {
        teachersFormIds = "";
      } else {
        teachersFormIds = teacherId;
        selectedPrimaryTeacher[teacherName] = commandItemDetails;
      }

      // Modify local form to trigger reactivity
      localForm.setValue("primaryTeacherId", teachersFormIds, {
        shouldValidate: true,
      });

      // Modify main form to store final values and allow details retrieval to allow avatar display in the class creation component
      form.setValue("primaryTeacherId", teachersFormIds, {
        shouldValidate: true,
      });

      form.setValue("primaryTeacherValue", selectedPrimaryTeacher, {
        shouldValidate: true,
      });

      closeDialog(null, pageId);
    },
    []
  );

  /**
   * Initial fetch setup
   *
   * @description Sets up the fetch parameters for retrieving students and triggers the fetch on component mount.
   */
  useEffect(() => {
    const metaData = {};
    metaData.dataReshapeFn = API_ENDPOINTS.GET.TEACHERS.dataReshape;
    metaData.apiEndpoint = API_ENDPOINTS.GET.TEACHERS.endpoint;
    metaData.task = pageId;
    metaData.form = form;

    openingCallback(true, metaData, null);
  }, []);

  const handleSubmit = () => {
    closeDialog(null, pageId);
  };

  return (
    <>
      <CommandItemsForComboBox
        avatarDisplay
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
