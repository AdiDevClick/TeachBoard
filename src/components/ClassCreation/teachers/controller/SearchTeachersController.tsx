import type { SearchTeachersControllerProps } from "@/components/ClassCreation/teachers/types/search-teachers.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export function SearchTeachersController({
  pageId,
  form,
  localForm,
  selectedTeacher,
  formId,
}: Readonly<SearchTeachersControllerProps>) {
  const {
    fetchParams,
    data,
    closeDialog,
    dialogOptions,
    setDialogOptions,
    openingCallback,
  } = useCommandHandler({
    form: localForm,
    pageId,
  });

  const queryClient = useQueryClient();
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

  return null;
}
