import { fetchJSON } from "@/api/api.ts";
import { getErrorMessage } from "@/api/errorFunctions.ts";
import {
  type FetchJSONError,
  type FetchJSONSuccess,
} from "@/api/types/api.types";
import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import type {
  FetchArgs,
  MutationVariables,
  QueryKeyDescriptor,
} from "@/hooks/database/types/QueriesTypes.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";
import { wait, waitAndFail } from "@/utils/utils";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const completedControllers = new WeakMap<AbortController, boolean>();

/**
 * Options for the mutation hook.
 * @description Centralizing mutation functions
 *
 * @param queryKeysArr An array where the first element is the task identifier string and the second element is the query descriptor object. {@link QueryKeyDescriptor}
 * @param getAbortController A function that returns the current AbortController instance.
 * This allows the mutation function to always use the latest controller, enabling proper handling of successive submissions without interference from previous aborted controllers.
 */
const mutationOptions = <
  S extends ResponseInterface<unknown>,
  E extends ApiError,
>(
  queryKeysArr: QueryKeyDescriptor<S, E>,
  getAbortController: () => AbortController,
): UseMutationOptions<
  FetchJSONSuccess<S>,
  FetchJSONError<E>,
  MutationVariables
> => {
  const {
    url,
    method = "GET",
    successDescription,
    silent,
    headers,
    onSuccess,
    onError,
    reset,
    localState,
  } = queryKeysArr[1];

  return {
    mutationKey: queryKeysArr,
    mutationFn: (variables) => {
      const fetchArgs = {
        bodyVariables: variables,
        method,
        url,
        abortController: getAbortController(),
        headers,
      };
      return onFetch<S, E>(fetchArgs);
    },
    onSuccess: (response) => {
      localState?.({ success: response, error: null });
      reset?.();
      onSuccess?.(response);
      if (silent) return;
      onQuerySuccess(response, successDescription);
    },
    onError: (error) => {
      onError?.(error);
      localState?.({ success: null, error: error });
      if (silent) return;
      onQueryError<E>(error);
    },
  };
};

const defaultStateParameters = { success: null, error: null };

/**
 * Handles form submission by triggering the query function.
 *
 * @description When a success occurs, an error reset is performed to clear any previous errors.
 *
 * @param queryKeysArr An array where the first element is the task identifier string and the second element is the query descriptor object. {@link QueryKeyDescriptor}
 *
 * @example
 * ```tsx
 * const { data, isLoading, isLoaded, error, onSubmit } = useQueryOnSubmit([
 *   USER_ACTIVITIES.signup,
 *   {
 *    url: API_ENDPOINTS.POST.SIGNUP,
 *   method: "POST",
 *  successDescription: "Signup successful.",
 * onSuccess(data) {
 *   console.log("Signup successful:", data);
 * },
 * onError(error) {
 *   console.error("Signup error:", error);
 * }
 * ]);
 * ```
 */
export function useQueryOnSubmit<
  S extends ResponseInterface<unknown>,
  E extends ApiError,
>(queryKeysArr: QueryKeyDescriptor<S, E>) {
  const { reset } = useQueryErrorResetBoundary();
  const abortControllerRef = useRef(new AbortController());
  const [localState, setLocalState] = useState<{
    error: FetchJSONError<E> | null;
    success: FetchJSONSuccess<S> | null;
  }>(defaultStateParameters);

  queryKeysArr[1].abortController ??= abortControllerRef.current;
  queryKeysArr[1].reset = reset;

  queryKeysArr[1].localState = (next) => {
    setLocalState(next);
  };

  // Memoize mutation options to prevent observer recreation on every render.  we
  // supply a getter instead of the controller itself so that the mutation
  // function can always grab the latest value (see discussion in GitHub issue).
  const options = useMemo(
    () => mutationOptions<S, E>(queryKeysArr, () => abortControllerRef.current),
    [queryKeysArr],
  );

  const { mutateAsync, data, isPending, error } = useMutation(options);

  /**
   * Handles form submission by triggering the mutation function.
   * @description This is a wrapper around mutateAsync to be used as a query function and avoid direct exposure of mutateAsync that triggers side effects.
   *
   * @param variables The variables to be passed to the mutation function.
   */
  const onSubmit = useCallback(
    async (variables: MutationVariables = undefined) => {
      // !! IMPORTANT !! Reset local error
      try {
        if (localState.error !== null) setLocalState(defaultStateParameters);

        // Abort the previous request if it's still pending to prevent
        if (abortControllerRef.current.signal.aborted) {
          abortControllerRef.current = new AbortController();
          queryKeysArr[1].abortController = abortControllerRef.current;
        }

        if (DEV_MODE && !NO_QUERY_LOGS) {
          console.debug("useQueryOnSubmit executing mutation", {
            key: queryKeysArr?.[0],
            url: queryKeysArr?.[1]?.url,
            method: queryKeysArr?.[1]?.method,
          });
        }

        return await mutateAsync(variables);
      } catch (err) {
        if (DEV_MODE && !NO_QUERY_LOGS) {
          console.error("useQueryOnSubmit mutation rejected", err);
        }

        return err;
      }
    },
    [mutateAsync, localState.error, queryKeysArr],
  );

  return {
    data: localState.success ?? data,
    isLoading: isPending,
    isLoaded: !!data,
    error: localState.error ?? error,
    onSubmit,
  };
}

/**
 * Fetch data from the API using the provided variables.
 *
 * @description This function is used as the mutation function for the useMutation hook.
 *
 * @param variables The variables to be sent in the request body.
 * @returns The mutation response object.
 */
export async function onFetch<
  TSuccess extends ResponseInterface<unknown>,
  TError extends ApiError,
>({
  retryTimeout = 1000,
  retry = 3,
  ...fetchArgs
}: FetchArgs): Promise<FetchJSONSuccess<TSuccess>> {
  const { bodyVariables, method, url, headers, ...rest } = fetchArgs;
  const completedRequest = "Request completed";
  let abortController = rest.abortController;
  const isAlreadyCompleted = abortController
    ? completedControllers.get(abortController)
    : false;

  // !! IMPORTANT !! On recursives, it needs to be reset
  if (isAlreadyCompleted) {
    abortController = new AbortController();
  }

  const signal = abortController?.signal;

  try {
    // This should never trigger on a first fetch except if called with an already
    // aborted controller that was *not* marked as completed by us (i.e. the user
    // cancelled before we began).  In that case we propagate a 499-style error.
    if (signal?.aborted && !completedControllers.get(abortController!)) {
      const reason = signal.reason;

      throw new Error("Request aborted", {
        cause: {
          status: 499,
          error: "Client Closed Request",
          message: reason ?? "The request was aborted by the client.",
        },
      });
    }

    const fetchPromise = fetchJSON<TSuccess, TError>(getUrl(url), {
      method: method,
      json: bodyVariables,
      signal,
      headers: headers,
    });

    const timeoutPromise = (
      waitAndFail(6000, "Request Timeout", abortController) as Promise<
        FetchJSONError<TError>
      >
    ).catch((err) => {
      // !! IMPORTANT !! return the cause so that race logic sees the status
      return err.cause;
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);
    // Cancel pending (either fetch or timeout) to avoid unnecessary work and potential memory leaks.
    if (abortController) {
      completedControllers.set(abortController, true);
      abortController.abort(completedRequest);
    }

    if (!response || response?.ok !== true) {
      const status = response?.status ?? 0;
      const message = getErrorMessage(status, response, retry);

      throw new Error(message, {
        cause: { ...response },
      });
    }
    return response;
  } catch (error) {
    const err = error as Error;
    // The message will always prioritize the one from the error cause,
    // Then the one from the error itself, and finally a generic fallback.
    const errorCause = {
      message: err.message,
      ...(err.cause as FetchJSONError<TError>),
    };

    if (shouldRetry(errorCause.status, retry)) {
      await wait(retryTimeout);
      return onFetch({
        ...fetchArgs,
        retry: retry - 1,
        retryTimeout: retryTimeout * 2,
      });
    }
    throw errorCause;
  }
}

/**
 * Handle query success by showing a toast notification.
 *
 * @description Use this function to centralize success handling logic if needed.
 *
 * @param response The mutation response object.
 */
function onQuerySuccess<TSuccess extends ResponseInterface<unknown>>(
  response: FetchJSONSuccess<TSuccess>,
  querySuccessDescription?: string,
) {
  const successMessage = response.success ?? undefined;
  toast(successMessage ?? "Success", {
    description: querySuccessDescription,
    position: "top-right",
  });
}

/**
 * Handle query error by showing a toast notification.
 *
 * @description Use this function to centralize error handling logic if needed.
 *
 * @param error The mutation error object.
 */
function onQueryError<TError extends ApiError>(error: FetchJSONError<TError>) {
  toast.error(error.message ?? error.error);
}

/**
 * Get the URL from the query descriptor.
 *
 * @param descriptor Endpoint's string
 * @returns
 */
function getUrl(url?: string): string {
  if (!url || url === null) {
    throw new Error(
      "Missing url in query descriptor passed to useQueryOnSubmit.",
    );
  }

  return url;
}

/**
 * Determine if the request should be retried based on status and remaining retries.
 *
 * @param status HTTP status code
 * @param retry Remaining retry attempts
 * @returns True if the request should be retried, false otherwise
 */
function shouldRetry(status: number, retry: number): boolean {
  if (typeof status !== "number") {
    return false;
  }

  return retry > 0 && status >= 500;
}
