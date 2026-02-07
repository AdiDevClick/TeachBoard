import type {
  CommandSelectionItemProps,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
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
import {
  retrieveValuesByMode,
  setValuesAfterAnimation,
} from "@/hooks/database/classes/functions/use-command-handler.functions.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import type { MutationVariables } from "@/hooks/database/types/QueriesTypes.ts";
import type {
  CommandHandlerMetaData,
  GlobalWithInvalidSubmit,
  HandleAddNewItemParams,
  HandleOpeningCallbackParams,
  HandleSelectionCallbackParams,
  HandleSubmitCallbackParams,
  InferServerData,
  InferViewData,
  UseCommandHandlerParams,
} from "@/hooks/database/types/use-command-handler.types.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/types/AppInputControllerInterface";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import {
  startTransition,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
} from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

/**
 * Custom hook to handle command operations including data fetching, dialog management, and form submissions.
 *
 * @param form - The form instance to manage form state and actions
 * @param pageId - The identifier for the current page or module
 */
export function useCommandHandler<
  TFieldValues extends FieldValues = FieldValues,
  TRoute = unknown,
  TSubmitReshapeFn = never,
  TServerData = InferServerData<TRoute, TSubmitReshapeFn>,
  TViewData = InferViewData<TRoute, TSubmitReshapeFn>,
  E extends ApiError = ApiError,
  TMeta extends CommandHandlerMetaData = CommandHandlerMetaData,
>(params: UseCommandHandlerParams<TFieldValues, TRoute, TSubmitReshapeFn>) {
  const { form, pageId } = params;
  const {
    fetchParams,
    onSubmit,
    setFetchParams,
    isLoaded,
    error,
    data,
    response,
    serverData,
    isLoading,
  } = useFetch<TServerData, E, TViewData>();

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

  /**
   * Handle adding a new item/feature
   *
   * @description Opens the dialog for creating a new item with appropriate parameters
   *
   * @param e - The event that triggered the addition
   * @param rest - Additional parameters for the new item to pass to the dialog as options
   */
  const handleAddNewItem = ({ e, ...rest }: HandleAddNewItemParams) => {
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
  };

  /**
   * Handle form submission
   *
   * @param variables - form variables
   * @param submitOpts - submission options
   */
  function handleSubmit(
    variables: HandleSubmitCallbackParams["variables"],
    submitOpts?: HandleSubmitCallbackParams["submitOpts"],
  ) {
    const options = dialogOptions(pageId) as
      | (CommandHandlerMetaData & { queryKey?: FetchParams["cachedFetchKey"] })
      | undefined;
    const {
      dataReshapeFn,
      endpointUrl,
      method = "GET",
      ...rest
    } = submitOpts ?? {};

    // Default to GET
    // It will grab information from the input controller's apiEndpoint and dataReshapeFn
    let reshapeFn = dataReshapeFn ?? options?.dataReshapeFn;
    let endpointUrlFinal = endpointUrl ?? options?.apiEndpoint;

    // For non-GET methods, override with provided endpoint and reshaper
    if (method !== "GET") {
      reshapeFn =
        dataReshapeFn ?? (params.submitDataReshapeFn as DataReshapeFn);
      endpointUrlFinal = endpointUrl ?? (params.submitRoute as ApiEndpointType);
    }

    // Store variables for deferred submission
    postVariables.current = variables;

    // Update fetchParams - this will trigger the useEffect above
    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.debug(
        "handleSubmit setting fetchParams",
        {
          endpointUrlFinal,
          options,
          cachedFetchKey: options?.queryKey,
          reshapeFn,
        },
        " variables:",
        variables,
      );
    }

    setFetchParams((prev) => ({
      ...prev,
      url: endpointUrlFinal ?? "none",
      cachedFetchKey: options?.queryKey,
      method: API_ENDPOINTS.POST.METHOD,
      contentId: pageId,
      dataReshapeFn: reshapeFn,
      abortController: new AbortController(),
      ...rest,
    }));
  }

  /**
   * Handle Class Creation form submission when there are validation errors
   *
   * @param errors - The validation errors
   */
  const handleInvalidSubmit = (errors: FieldErrors<TFieldValues>) => {
    if (DEV_MODE) {
      const currentValues = form.getValues();

      (
        globalThis as GlobalWithInvalidSubmit<TFieldValues>
      ).__TB_CLASS_CREATION_LAST_INVALID_SUBMIT__ = {
        at: Date.now(),
        keys: Object.keys(errors ?? {}),
        values: {
          ...currentValues,
        },
      };

      if (!NO_CACHE_LOGS) {
        console.debug(pageId + " invalid submit", errors);
      }
    }
  };

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, FETCH data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  const handleOpening = (
    open: boolean,
    metaData?: HandleOpeningCallbackParams<TMeta>["metaData"],
  ) => {
    if (!open) return;

    const task = metaData?.task as FetchParams["contentId"];
    const apiEndpoint = metaData?.apiEndpoint ?? "none";
    const dataReshapeFn = metaData?.dataReshapeFn;
    let silent = metaData?.silent;
    const controller = new AbortController();
    // Fail fast when a command/modal expects an endpoint but none is provided.
    // This catches regressions where inputControllers drift from API_ENDPOINTS.
    if (fetchParamsPropsInvalid<TMeta>(metaData)) {
      const message = `[useCommandHandler] Missing fetchParams for task "${String(
        task,
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

    if (apiEndpoint === "none") {
      controller.abort("Pure cache - No API fetch for this command");
      silent = true;
    }

    setFetchParams((prev): FetchParams => {
      return {
        ...prev,
        dataReshapeFn: dataReshapeFn ?? prev.dataReshapeFn,
        url: String(apiEndpoint),
        contentId: task,
        abortController: controller,
        silent,
      };
    });
  };

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
  const handleSelection = (
    value: HandleSelectionCallbackParams<TFieldValues>["value"],
    options: HandleSelectionCallbackParams<TFieldValues>["options"],
  ) => {
    const {
      mainFormField,
      secondaryFormField,
      detailedCommandItem,
      validationMode = "array",
    } = options;

    const isSelected = detailedCommandItem?.isSelected;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.debug("Command selected:", {
        mainFormField,
        secondaryFormField,
        value,
        detailedCommandItem,
      });
    }

    // Use secondaryFormField if provided (this is the detailed data one), otherwise fallback to mainFormField
    const retrievedFormField = new UniqueSet<
      string,
      CommandSelectionItemProps["command"]
    >(null, form.getValues(secondaryFormField ?? mainFormField) || []);

    if (retrievedFormField.has(value) || isSelected === false) {
      retrievedFormField.delete(value);
    } else {
      if (validationMode === "single") {
        retrievedFormField.clear();
      }
      retrievedFormField.set(value, detailedCommandItem);
    }

    const values = retrieveValuesByMode(validationMode, retrievedFormField);

    setValuesAfterAnimation(
      mainFormField,
      secondaryFormField as Path<TFieldValues>,
      retrievedFormField,
      values as PathValue<TFieldValues, Path<TFieldValues>>,
      form,
    );
  };

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
  const handleDataCacheUpdate = useCallback(() => {
    const cacheKey = fetchParams.cachedFetchKey ?? [
      fetchParams.contentId,
      fetchParams.url,
    ];
    const cachedData = queryClient.getQueryData<HeadingType[]>(cacheKey);

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Cached data for ", cacheKey, " is ", cachedData);
    }

    return cachedData ?? data;
  }, [queryClient, data, fetchParams]);

  const afterAnimationClose = useEffectEvent(() => {
    startTransition(async () => {
      closeDialog(null, pageId);
    });
  });

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
        afterAnimationClose();
      }
    }
  }, [isLoaded, error, data, form, pageId]);

  const triggerSubmit = useEffectEvent((fetchParams: FetchParams) => {
    if (isLoading || hasStartedCreation.current) return;

    if (postVariables.current) {
      // POST only
      hasStartedCreation.current = true;
      onSubmit(postVariables.current);
    } else {
      // FETCH only
      const { keys, shouldNotFetch, isInitialFetchParams } =
        resolvedReturnCases(fetchParams);

      if (shouldNotFetch || isInitialFetchParams) {
        return;
      }

      const cachedData = queryClient.getQueryData(keys);

      if (cachedData === undefined) {
        hasStartedCreation.current = true;
        onSubmit();
      }
    }
  });

  /**
   * Effect to FETCH or SUBMIT data when fetchParams change
   *
   * @description Triggers when fetchParams are updated with {@link handleOpening}
   */
  useEffect(() => {
    triggerSubmit(fetchParams);
  }, [fetchParams]);

  return {
    ...mutationObs,
    // Reshaped view data (usually cached + rendered by controllers)
    data,

    // Raw server response and payload (typed per `route` when provided)
    response,
    serverData,
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
    invalidSubmitCallback: handleInvalidSubmit,
    openedDialogs,
    setDialogOptions,
  };
}

/**
 * Handle return cases for data fetching based on fetchParams
 *
 * @description This allows to centralize some return cases
 *
 * @param fetchParams - The parameters for the fetch operation, including URL, contentId, and abortController.
 *
 * @return An object containing flags for pure cache abort, whether to fetch, and if the fetchParams are in their initial state.
 */
function resolvedReturnCases(fetchParams: FetchParams) {
  const { contentId, url, abortController } = fetchParams;
  const keys = [contentId, url];

  const abortReason = abortController?.signal.reason;
  const isPureCacheAbort = abortReason?.includes(
    "Pure cache - No API fetch for this command",
  );
  const shouldNotFetch = url === "none" || isPureCacheAbort;
  const isInitialFetchParams = keys[1] === "" && keys[0] === "none";

  return {
    shouldNotFetch,
    isInitialFetchParams,
    keys,
  };
}
