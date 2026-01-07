import type { HeadingType } from "@/components/Command/types/command.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  debugLogs,
  fetchParamsPropsInvalid,
} from "@/configs/app-components.config.ts";
import {
  DEV_MODE,
  NO_CACHE_LOGS,
  NO_QUERY_LOGS,
} from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type {
  CommandHandlerMetaData,
  HandleAddNewItemParams,
  HandleOpeningCallbackParams,
  HandleSelectionCallbackParams,
  HandleSubmitCallbackParams,
  UseCommandHandlerParams,
} from "@/hooks/database/types/use-command-handler.types.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { FieldValues, Path, PathValue } from "react-hook-form";

/**
 * Custom hook to handle command operations including data fetching, dialog management, and form submissions.
 *
 * @param form - The form instance to manage form state and actions
 * @param pageId - The identifier for the current page or module
 */
export function useCommandHandler<
  TFieldValues extends FieldValues,
  TMeta extends CommandHandlerMetaData
>({ form, pageId }: UseCommandHandlerParams<TFieldValues, TMeta>) {
  const {
    fetchParams,
    onSubmit,
    setFetchParams,
    isLoaded,
    error,
    data,
    isLoading,
  } = useFetch();
  const {
    openDialog,
    closeDialog,
    dialogOptions,
    onOpenChange,
    openedDialogs,
    setDialogOptions,
  } = useDialog();

  const queryClient = useQueryClient();
  const mutationObs = useMutationObserver({});

  const hasStartedCreation = useRef(false);
  const postVariables = useRef<MutationVariables>(null);

  const currentQueryCacheAndKey = useMemo(() => {
    const key = [fetchParams.contentId, fetchParams.url];
    return {
      cacheKey: key,
      cachedData: queryClient.getQueryData<HeadingType[]>(key),
    };
  }, [queryClient, fetchParams, data]);

  /**
   * Handle adding a new item/feature
   *
   * @description Opens the dialog for creating a new item with appropriate parameters
   *
   * @param e - The event that triggered the addition
   * @param rest - Additional parameters for the new item to pass to the dialog as options
   */
  const handleAddNewItem = useCallback(
    ({ e, ...rest }: HandleAddNewItemParams) => {
      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.log("Add new item triggered", {
          ...rest,
        });
      }

      const task = rest.task ?? pageId;

      openDialog(e, task, {
        ...rest,
        queryKey: [task, rest.apiEndpoint],
      });
    },
    []
  );

  /**
   * Handle form submission
   *
   * @param variables - form variables
   * @param endpointUrl - The API endpoint URL
   * @param dataReshapeFn - Function to reshape the response data
   */
  const handleSubmit = useCallback(
    (
      variables: HandleSubmitCallbackParams["variables"],
      endpointUrl: HandleSubmitCallbackParams["endpointUrl"],
      dataReshapeFn: HandleSubmitCallbackParams["dataReshapeFn"],
      reshapeOptions: HandleSubmitCallbackParams["reshapeOptions"] = null,
      silent: HandleSubmitCallbackParams["silent"] = false
    ) => {
      const options = dialogOptions(pageId);

      // Store variables for deferred submission
      postVariables.current = variables;

      // Update fetchParams - this will trigger the useEffect above
      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.debug(
          "handleSubmit setting fetchParams",
          {
            endpointUrl,
            options,
            cachedFetchKey: options?.queryKey,
            dataReshapeFn: dataReshapeFn ?? options?.dataReshapeFn,
          },
          " variables:",
          variables
        );
      }

      setFetchParams((prev) => ({
        ...prev,
        url: endpointUrl ?? options?.apiEndpoint,
        cachedFetchKey: options?.queryKey,
        // cachedFetchKey: options?.queryKey ?? [],
        method: API_ENDPOINTS.POST.METHOD,
        contentId: options?.task ?? pageId,
        dataReshapeFn: dataReshapeFn ?? options?.dataReshapeFn,
        reshapeOptions,
        silent,
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
  const handleOpening = useCallback(
    (
      open: boolean,
      metaData?: HandleOpeningCallbackParams<TMeta>["metaData"]
    ) => {
      if (!open) return;

      const task = metaData?.task as FetchParams["contentId"];
      const apiEndpoint = metaData?.apiEndpoint;
      const dataReshapeFn = metaData?.dataReshapeFn;
      const silent = metaData?.silent;

      // Fail fast when a command/modal expects an endpoint but none is provided.
      // This catches regressions where inputControllers drift from API_ENDPOINTS.
      if (!fetchParamsPropsInvalid(metaData ?? {})) {
        const message = `[useCommandHandler] Missing fetchParams for task "${String(
          task
        )}". Ensure the related input controller is wired to API_ENDPOINTS.*.endPoint(s).`;
        debugLogs(message);
        throw new Error(message);
      }

      // Ensure apiEndpoint is present and correspond to a known input
      // const found = inputControllers.find(
      //   (input: (typeof inputControllers)[number]) =>
      //     input.task === task && input.apiEndpoint === apiEndpoint
      // );
      // if (!found) return;

      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.debug("handleOpening callback in CommandHandler", metaData);
      }

      setFetchParams(
        (prev): FetchParams => ({
          ...prev,
          dataReshapeFn: dataReshapeFn ?? prev.dataReshapeFn,
          url: (apiEndpoint ?? prev.url) as string,
          contentId: task ?? prev.contentId,
          silent,
        })
      );
    },
    []
  );

  /**
   * Handle selection from command list
   *
   * @description Updates form fields based on the selected command item.
   * It will save 2 fields:
   *  - mainFormField: an array of selected values
   *  - secondaryFormField: an array of [value, detailedCommandItem] entries for further use.
   *
   * @remarks Use the mainFormField for form submissions and the secondaryFormField for detailed data access.
   *
   * @remarks By default, this function supports multi-selection. To enforce single selection, set `validationMode` to "single".
   *
   * @param value - Selected value
   * @param options - Options containing form field names and detailed command item
   */
  const handleSelection = useCallback(
    (
      value: HandleSelectionCallbackParams["value"],
      options: HandleSelectionCallbackParams["options"]
    ) => {
      const mainFormField = options.mainFormField as Path<TFieldValues>;
      const secondaryFormField =
        options.secondaryFormField as Path<TFieldValues>;
      const detailedCommandItem = options.detailedCommandItem;
      const isSelected = detailedCommandItem?.isSelected;
      const validationMode = options.validationMode ?? "array";

      if (DEV_MODE && !NO_CACHE_LOGS) {
        console.debug("Command selected:", {
          mainFormField,
          secondaryFormField,
          value,
          detailedCommandItem,
        });
      }

      const retrievedFormField = new UniqueSet<
        string,
        Record<string, unknown> & { isSelected?: boolean }
      >(null, form.getValues(secondaryFormField) || []);

      if (retrievedFormField.has(value) || isSelected === false) {
        retrievedFormField.delete(value);
      } else {
        if (validationMode === "single") {
          retrievedFormField.clear();
        }
        retrievedFormField.set(value, detailedCommandItem);
      }

      let values: unknown = Array.from(retrievedFormField.keys());
      if (validationMode === "single") {
        if (Array.isArray(values) && values.length > 0) {
          values = values[0];
        } else {
          values = "";
        }
      }

      if (mainFormField) {
        form.setValue(
          mainFormField,
          values as PathValue<TFieldValues, Path<TFieldValues>>,
          {
            shouldValidate: true,
          }
        );
      }

      if (secondaryFormField) {
        form.setValue(
          secondaryFormField,
          Array.from(retrievedFormField.entries()) as PathValue<
            TFieldValues,
            Path<TFieldValues>
          >,
          {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          }
        );
      }
    },
    []
  );

  /**
   * Handle data cache update
   *
   * @description Retrieves cached data if available, otherwise returns the fetched data.
   *
   * @remarks In order to use this function, pass it as a callback to the command component.
   *
   * @return The cached data if available, otherwise the fetched data
   * 
   * @example
   * ```tsx
   * <PopoverFieldWithCommands
           onSelect={handleCommandSelection}
           onOpenChange={handleOpening}
           onAddNewItem={newItemCallback}
           commandHeadings={resultsCallback()} // <-- here
     />
    * ```
   */
  const handleDataCacheUpdate = useCallback((): HeadingType[] | undefined => {
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log(
        "Cached data for ",
        currentQueryCacheAndKey.cacheKey,
        " is ",
        currentQueryCacheAndKey.cachedData
      );
    }

    return (currentQueryCacheAndKey.cachedData ?? data) as
      | HeadingType[]
      | undefined;
  }, [
    currentQueryCacheAndKey.cacheKey,
    currentQueryCacheAndKey.cachedData,
    data,
  ]);

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
        console.debug(pageId, " created:", data);
      }
      if (isSubmition) {
        postVariables.current = null;
        // NOTE: form.reset() is intentionally NOT called here.
        // The setRef callback in useMutationObserver calls setState during render,
        // which causes "Cannot update a component while rendering" warnings.
        // For navigation flows (like login), the form will be unmounted anyway.
        // For dialog flows, the dialog closing will handle the form state.
        startTransition(async () => {
          // form.reset();
          // await wait(APP_REDIRECT_TIMEOUT_SUCCESS);
          closeDialog(null, pageId);
        });
      }
    }
  }, [isLoaded, error, data, form]);

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
      const cachedData = queryClient.getQueryData(keys);

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
    onOpenChange,
    postVariables,
    newItemCallback: handleAddNewItem,
    submitCallback: handleSubmit,
    openingCallback: handleOpening,
    selectionCallback: handleSelection,
    resultsCallback: handleDataCacheUpdate,
    openedDialogs,
    setDialogOptions,
  };
}
