import type {
  CommandSelectionItemProps,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import {
  debugLogs,
  fetchParamsPropsInvalid,
} from "@/configs/app-components.config.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import {
  retrieveValuesByMode,
  setValuesAfterAnimation,
} from "@/hooks/database/classes/functions/use-command-handler.functions.ts";
import { resolveFetchCacheKey } from "@/hooks/database/fetches/functions/use-fetch.functions";
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
  UseCommandHandlerParams,
} from "@/hooks/database/types/use-command-handler.types.ts";
import { useMutationObserver } from "@/hooks/useMutationObserver.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { DataReshapeFn } from "@/types/AppInputControllerInterface";
import type { ApiSuccess } from "@/types/AppResponseInterface";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useEffect, useEffectEvent, useRef } from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { toast } from "sonner";
const DEFAULT_SUBMISSION_LOADING_MESSAGE = "Demande en cours...";
const SUBMISSION_TOAST_ID_PREFIX = "command-handler-submit";

/**
 * Custom hook to handle command operations including data fetching, dialog management, and form submissions.
 *
 * @param form - The form instance to manage form state and actions
 * @param pageId - The identifier for the current page or module
 */
type NormalizeMeta<T> = T extends object ? T : Record<string, never>;
type TMeta = CommandHandlerMetaData;
type ResolvedSubmissionToastOptions = {
  toastId: string;
  loadingMessage: string;
  showLoadingToast: boolean;
};

export function useCommandHandler<
  TForm extends FieldValues,
  TRoute = unknown,
  TSubmitReshapeFn = unknown,
  S extends ApiSuccess<object> = ApiSuccess<
    NormalizeMeta<InferServerData<NonNullable<TRoute>, TSubmitReshapeFn>>
  >,
  E extends ApiError = ApiError,
>(params: UseCommandHandlerParams<TForm, TRoute, TSubmitReshapeFn>) {
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
  } = useFetch<S, E>();

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
  const submissionToastOptionsRef = useRef<ResolvedSubmissionToastOptions>(
    createDefaultSubmissionToastOptions(String(pageId)),
  );

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
      method = "POST",
      toastOptions,
      ...rest
    } = submitOpts ?? {};

    // Update toast options for this submission
    submissionToastOptionsRef.current = {
      ...submissionToastOptionsRef.current,
      ...toastOptions,
    };

    // In order :
    // Direct submitOpts (hardcoded by the call) -> defaults hook params (hardcoded on hook mount) -> dialog options (dialog options should be a GET endpoint since data sharing is called on opening most of the time) -> "none" (default fallback to avoid undefined endpoint)
    const reshapeFn =
      dataReshapeFn ??
      (params.submitDataReshapeFn as DataReshapeFn) ??
      options?.dataReshapeFn;
    const endpointUrlFinal =
      endpointUrl ?? params.submitRoute ?? options?.apiEndpoint;

    // Store variables for deferred submission
    postVariables.current = variables;

    // Update fetchParams - this will trigger the useEffect above
    debugLogs("useCommandHandler:handleSubmit", {
      type: "cacheLogs",
      endpointUrlFinal,
      options,
      cachedFetchKey: options?.queryKey,
      reshapeFn,
      variables,
    });

    setFetchParams((prev) => ({
      ...prev,
      silent: false,
      url: String(endpointUrlFinal ?? "none"),
      cachedFetchKey: options?.queryKey,
      method,
      contentId: pageId as FetchParams["contentId"],
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
  function handleInvalidSubmit(errors: FieldErrors<TForm>) {
    if (DEV_MODE) {
      const currentValues = form.getValues();

      (
        globalThis as GlobalWithInvalidSubmit<TForm>
      ).__TB_CLASS_CREATION_LAST_INVALID_SUBMIT__ = {
        at: Date.now(),
        keys: Object.keys(errors ?? {}),
        values: {
          ...currentValues,
        },
      };

      debugLogs("useCommandHandler:handleInvalidSubmit", {
        type: "cacheLogs",
        errors,
      });
    }
  }

  /**
   * Handle opening of the VerticalFieldSelect component
   *
   * @description When opening, FETCH data based on the select's meta information
   *
   * @param open - Whether the select is opening
   * @param metaData - The meta data from the popover field that was opened
   */
  function handleOpening(
    open: boolean,
    metaData?: HandleOpeningCallbackParams<TMeta>["metaData"],
  ) {
    if (!open) return;

    const {
      task,
      searchParams,
      apiEndpoint = "none",
      dataReshapeFn,
    } = metaData ?? {};

    let silent = metaData?.silent;
    const controller = new AbortController();

    if (fetchParamsPropsInvalid<TMeta>(metaData)) {
      const message = `[useCommandHandler] Missing fetchParams for task "${String(
        task,
      )}". Ensure the related input controller is wired to API_ENDPOINTS.*.endPoint(s).`;

      debugLogs(message);
      throw new Error(message);
    }

    debugLogs("useCommandHandler:handleOpening", {
      type: "cacheLogs",
      ...metaData,
    });

    if (apiEndpoint === "none") {
      controller.abort("Pure cache - No API fetch for this command");
      silent = true;
    }

    setFetchParams((prev) => ({
      ...prev,
      searchParams,
      dataReshapeFn,
      url: String(apiEndpoint),
      contentId: task as FetchParams["contentId"],
      abortController: controller,
      silent,
    }));
  }

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
  function handleSelection(
    value: HandleSelectionCallbackParams<TForm>["value"],
    options: HandleSelectionCallbackParams<TForm>["options"],
  ) {
    const {
      mainFormField,
      secondaryFormField,
      detailedCommandItem,
      validationMode = "array",
    } = options;

    const isSelected = detailedCommandItem?.isSelected;

    debugLogs("useCommandHandler:handleSelection", {
      type: "cacheLogs",
      value,
      mainFormField,
      secondaryFormField,
      detailedCommandItem,
      validationMode,
    });

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
      secondaryFormField as Path<TForm>,
      retrievedFormField,
      values as PathValue<TForm, Path<TForm>>,
      form,
    );
  }

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
           onClick={newItemCallback}
           commandHeadings={resultsCallback()} // <-- here
     />
    * ```
   */
  const handleDataCacheUpdate = <T = HeadingType[]>(): T | undefined => {
    const cacheKey = resolveFetchCacheKey(fetchParams);
    const cachedData = queryClient.getQueryData<T>(cacheKey);

    debugLogs("useCommandHandler:handleDataCacheUpdate", {
      type: "cacheLogs",
      cacheKey,
      cachedData,
    });

    return cachedData ?? (data as T | undefined);
  };
  /**
   * RESULTS - Handle dialog closing after successful submission
   */
  const afterAnimationClose = useEffectEvent(() => {
    startTransition(async () => {
      closeDialog(null, pageId);
    });
  });

  /**
   * Resets forms after a submission error to allow users to correct their input and resubmit.
   *
   * @remark The saves the previous state but unlocks the ability to submit again
   */
  const resetFormAfterSubmitError = useEffectEvent(() => {
    form.reset(undefined, {
      keepValues: true,
      keepErrors: true,
      keepDirty: true,
      keepTouched: true,
      keepIsSubmitted: false,
    });
  });

  /**
   * RESULTS - Handle form results
   *
   * @description Close dialog on success and reset form
   */
  useEffect(() => {
    const isSubmission = postVariables.current !== null;
    const { toastId, loadingMessage, showLoadingToast } =
      submissionToastOptionsRef.current;

    if (
      isLoading &&
      isSubmission &&
      showLoadingToast &&
      !toast.getToasts().some((currentToast) => currentToast.id === toastId)
    ) {
      toast.loading(loadingMessage, { id: toastId });
    }

    if (data || error) {
      hasStartedCreation.current = false;

      if (showLoadingToast) {
        toast.dismiss(toastId);
      }
    }

    if (data) {
      debugLogs("useCommandHandler:handleResults", {
        type: "cacheLogs",
        data,
        message: "Submission successful, closing dialog",
        pageId,
      });

      if (isSubmission) {
        postVariables.current = null;
        // NOTE: form.reset() is intentionally NOT called here.
        // The setRef callback in useMutationObserver calls setState during render,
        // which causes "Cannot update a component while rendering" warnings.
        // For navigation flows (like login), the form will be unmounted anyway.
        // For dialog flows, the dialog closing will handle the form state.
        afterAnimationClose();
      }
    }

    if (error && isSubmission) {
      resetFormAfterSubmitError();
    }
  }, [isLoading, isLoaded, error, data, pageId]);

  /**
   * FETCH / SUBMIT - Trigger submission or fetching when fetchParams are set
   */
  const triggerSubmit = useEffectEvent((fetchParams: FetchParams) => {
    if (isLoading || hasStartedCreation.current) return;
    const fetchType = fetchParams.method ?? "GET";

    if (fetchType === "POST" || fetchType === "PUT" || fetchType === "DELETE") {
      // With viarables
      if (postVariables.current) {
        hasStartedCreation.current = true;
        onSubmit(postVariables.current);
      } else {
        // A POST could be a submission without variables (eg. a delete action)
        onSubmit();
      }
    }

    if (fetchType === "GET") {
      const { cacheKey, shouldNotFetch, isInitialFetchParams } =
        resolvedReturnCases(fetchParams);

      // The useEffect already guards but this one is deeper, please keep it for safety
      if (shouldNotFetch || isInitialFetchParams) {
        return;
      }

      // For GET requests, check cache first
      const cachedData = queryClient.getQueryData(cacheKey);

      if (cachedData === undefined) {
        hasStartedCreation.current = true;
        onSubmit();
      }
    }
  });

  /**
   * FETCH / SUBMIT - Effect when fetchParams change
   *
   * @description Triggers when fetchParams are updated with {@link handleOpening}
   */
  useEffect(() => {
    if (fetchParams.contentId === "none") return;

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
    queryClient,
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

  const abortReason = abortController?.signal.reason;
  const isPureCacheAbort = abortReason?.includes(
    "Pure cache - No API fetch for this command",
  );

  const cacheKey = resolveFetchCacheKey(fetchParams);

  const shouldNotFetch = url === "none" || isPureCacheAbort;
  const isInitialFetchParams = url === "" && contentId === "none";

  return {
    shouldNotFetch,
    isInitialFetchParams,
    cacheKey,
  };
}

/**
 * Create default toast options for form submission feedback
 *
 * @description Makes sure that there is always a toastId (to avoid multiple toasts piling up on multiple submits) and a loading message.
 *
 * @remark The default loading message can be overridden by passing `toastOptions` in the `handleSubmit` options.
 *
 * @param pageId - The identifier for the current page or module, used to create a unique toast ID
 *
 * @returns An object containing default toast options for form submission feedback
 */
function createDefaultSubmissionToastOptions(
  pageId: string,
): ResolvedSubmissionToastOptions {
  return {
    toastId: `${SUBMISSION_TOAST_ID_PREFIX}-${pageId}`,
    loadingMessage: DEFAULT_SUBMISSION_LOADING_MESSAGE,
    showLoadingToast: true,
  };
}
