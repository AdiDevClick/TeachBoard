import { CommandItemsForComboBox } from "@/components/Command/exports/command-items.exports";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { SearchPrimaryTeacherControllerProps } from "@/features/class-creation/components/SearchTeachers/types/search-teachers.types.ts";
import { resetSelectedItemsFromCache } from "@/features/class-creation/index.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Controller for searching and selecting primary teachers.
 *
 * @param pageId - The unique identifier for the page/component using this controller
 * @param form - The form object managing the state of selected primary teacher
 * @param formId - The unique identifier for the form
 * @param localForm - The local form instance for dialog reactivity
 * @returns A SearchPrimaryTeacherController component
 */
export function SearchPrimaryTeacherController({
  pageId,
  form,
  localForm,
  className,
  formId,
}: SearchPrimaryTeacherControllerProps) {
  const { closeDialog, openingCallback, resultsCallback, selectionCallback } =
    useCommandHandler({
      form: form!,
      pageId,
    });

  const queryClient = useQueryClient();

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
  const handleOnSelect = (
    _value: string,
    commandItemDetails: CommandItemType,
  ) => {
    if (commandItemDetails.id === undefined || commandItemDetails.id === null)
      return;

    const teacherId = commandItemDetails.id;
    const currentTeacherId = form.getValues("primaryTeacherId");

    // Deselect the previous teacher in cache if there was one
    if (currentTeacherId && currentTeacherId !== teacherId) {
      const previousTeacherValue = form.getValues("primaryTeacherValue") ?? [];
      resetSelectedItemsFromCache(
        ["search-primaryteacher", API_ENDPOINTS.GET.TEACHERS.endpoint],
        previousTeacherValue,
        queryClient,
      );
    }

    selectionCallback(teacherId, {
      mainFormField: "primaryTeacherId",
      secondaryFormField: "primaryTeacherValue",
      detailedCommandItem: commandItemDetails,
      validationMode: "single",
    });

    // Sync the dialog-local form (reactivity)
    localForm.setValue("primaryTeacherId", form.getValues("primaryTeacherId"), {
      shouldValidate: true,
    });

    closeDialog(null, pageId);
  };

  /**
   * Initial fetch setup
   *
   * @description Sets up the fetch parameters for retrieving students and triggers the fetch on component mount.
   */
  useEffect(() => {
    const metaData = {
      dataReshapeFn: API_ENDPOINTS.GET.TEACHERS.dataReshape,
      apiEndpoint: API_ENDPOINTS.GET.TEACHERS.endpoint,
      task: pageId,
      form,
    };

    openingCallback(true, metaData);
  }, []);

  const handleSubmit = () => {
    closeDialog(null, pageId);
  };

  return (
    <>
      <CommandItemsForComboBox
        avatarDisplay
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
