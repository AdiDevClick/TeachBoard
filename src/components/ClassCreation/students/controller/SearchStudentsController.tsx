import { CommandItemsForComboBox } from "@/components/Command/CommandItems.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

export function SearchStudentsController({
  pageId,
  formId,
  inputControllers,
  className = "grid gap-4",
  form,
}: Readonly<SearchStudentsControllerProps>) {
  const {
    setRef,
    observedRefs,
    fetchParams,
    data,
    newItemCallback,
    openingCallback,
    submitCallback,
    dialogOptions,
  } = useCommandHandler({
    form,
    pageId,
  });
  const queryClient = useQueryClient();
  const savedSkills = useRef(null!);

  const diplomaDatas = useMemo(() => {
    const dialogData = dialogOptions(pageId);
    return {
      diploma: dialogData?.selectedDiploma ?? null,
      shortTemplatesList: dialogData?.shortTemplatesList ?? [],
    };
  }, [dialogOptions, pageId]);

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

  useEffect(() => {
    const metaData = {};

    metaData.apiEndpoint = API_ENDPOINTS.GET.STUDENTS.endpoint;
    metaData.dataReshapeFn = API_ENDPOINTS.GET.STUDENTS.dataReshape;

    openingCallback(open, metaData, inputControllers);
  }, []);

  return (
    <CommandItemsForComboBox
      avatarDisplay
      multiSelection
      commandHeadings={resultsCallback([
        fetchParams.contentId,
        fetchParams.url,
      ])}
    />
  );
}
