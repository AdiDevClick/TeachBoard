import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  DEV_MODE,
  NO_CACHE_LOGS,
  NO_QUERY_LOGS,
} from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useCallback, useEffect, useRef } from "react";

export function useCommandHandler({
  form,
  pageId,
}: {
  form: any;
  pageId: string;
}) {
  const {
    fetchParams,
    onSubmit,
    setFetchParams,
    isLoaded,
    error,
    data,
    isLoading,
  } = useFetch();
  const { openDialog, closeDialog, dialogOptions } = useDialog();
  const queryClient = useQueryClient();
  const mutationObs = useMutationObserver({});

  const hasStartedCreation = useRef(false);
  const postVariables = useRef<MutationVariables>(null!);

  const handleAddNewItem = useCallback(
    ({ e, apiEndpoint, task, dataReshapeFn }: HandleAddNewItemParams) => {
      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.log("Add new item triggered", {
          apiEndpoint,
          task,
        });
      }
      console.log("opening new degree item");

      openDialog(e, task, {
        task,
        apiEndpoint,
        dataReshapeFn,
        queryKey: [task, apiEndpoint],
      });
    },
    []
  );

  /**
   * Handle form results
   *
   * @description Close dialog on success and reset form
   */
  useEffect(() => {
    const isSubmition = postVariables.current !== null;
    if (data || error) {
      hasStartedCreation.current = false;
    }

    if (data) {
      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("NewDegreeItem created:", data);
      }
      if (isSubmition) {
        postVariables.current = null;
        form.reset();
        startTransition(() => {
          closeDialog(null, pageId);
        });
      }
    }
  }, [isLoaded, error, data, form]);

  /**
   * Handle form submission
   *
   * @param variables - form variables
   */
  const handleSubmit = useCallback(
    (
      variables: MutationVariables,
      endpointUrl: string,
      dataReshapeFn: string
    ) => {
      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.debug("useModuleCreation handleSubmit called", variables);
      }

      const options = dialogOptions(pageId);

      // Store variables for deferred submission
      postVariables.current = variables;

      // Update fetchParams - this will trigger the useEffect above
      setFetchParams((prev) => ({
        ...prev,
        url: endpointUrl ?? options.apiEndpoint,
        cachedFetchKey: options.queryKey ?? [],
        method: API_ENDPOINTS.POST.METHOD,
        contentId: options.task,
        dataReshapeFn: dataReshapeFn,
      }));
    },
    []
  );
  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, FETCH data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = useCallback((open, metaData, inputControllers) => {
    if (!open) return;

    const task = metaData?.task;
    const apiEndpoint = metaData?.apiEndpoint;
    const dataReshapeFn = metaData?.dataReshapeFn;

    // Ensure apiEndpoint is present and correspond to a known input
    const found = inputControllers.find(
      (input: (typeof inputControllers)[number]) =>
        input.task === task && input.apiEndpoint === apiEndpoint
    );
    if (!found) return;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.debug("handleOpening callback in CommandHandler", metaData);
    }

    setFetchParams((prev) => ({
      ...prev,
      dataReshapeFn: dataReshapeFn,
      url: apiEndpoint,
      contentId: task,
      method: "GET",
    }));
  }, []);

  /**
   * Effect to FETCH or SUBMIT data when fetchParams change
   *
   * @description Triggers when fetchParams are updated with {@link handleOpening}
   */
  useEffect(() => {
    if (isLoading || hasStartedCreation.current) return;

    if (postVariables.current) {
      // POST only
      hasStartedCreation.current = true;
      onSubmit(postVariables.current);
    } else {
      // FETCH only
      const keys = [fetchParams.contentId, fetchParams.url];

      // Avoid FetchParams initial state fetch
      if (keys[1] === "" && keys[0] === "none") return;
      const cachedData = queryClient.getQueryData(keys ?? []);

      if (cachedData === undefined) {
        hasStartedCreation.current = true;
        onSubmit();
      }
    }
  }, [fetchParams]);

  return {
    ...mutationObs,
    data,
    isLoading,
    error,
    isLoaded,
    fetchParams,
    setFetchParams,
    openDialog,
    closeDialog,
    dialogOptions,
    postVariables,
    newItemCallback: handleAddNewItem,
    submitCallback: handleSubmit,
    openingCallback: handleOpening,
  };
}
