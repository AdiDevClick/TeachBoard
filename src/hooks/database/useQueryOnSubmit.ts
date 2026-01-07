import { fetchJSON } from "@/api/api.ts";
import { getErrorMessage } from "@/api/errorFunctions.ts";
import {
  type FetchJSONError,
  type FetchJSONSuccess,
} from "@/api/types/api.types";
import { DEV_MODE } from "@/configs/app.config.ts";
import type {
  FetchArgs,
  MutationVariables,
  QueryKeyDescriptor,
} from "@/hooks/database/types/QueriesTypes.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";
import { wait } from "@/utils/utils";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Options for the mutation hook.
 * @description Centralizing mutation functions
 */
const mutationOptions = <S extends ResponseInterface, E extends ApiError>(
  queryKeysArr: QueryKeyDescriptor<S, E>
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
    abortController,
  } = queryKeysArr[1];

  return {
    mutationKey: queryKeysArr,
    mutationFn: (variables) => {
      const fetchArgs = {
        bodyVariables: variables,
        method,
        url,
        abortController: abortController,
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
  S extends ResponseInterface,
  E extends ApiError
>(queryKeysArr: QueryKeyDescriptor<S, E>) {
  const { reset } = useQueryErrorResetBoundary();
  const abortControllerRef = useRef(new AbortController());
  const [localState, setLocalState] = useState<{
    error: FetchJSONError<E> | null;
    success: FetchJSONSuccess<S> | null;
  }>({ error: null, success: null });

  queryKeysArr[1].abortController ??= abortControllerRef.current;
  queryKeysArr[1].reset = reset;

  queryKeysArr[1].localState = (next) => {
    setLocalState(next);
  };

  // Memoize mutation options to prevent observer recreation on every render
  const options = useMemo(
    () => mutationOptions<S, E>(queryKeysArr),
    [queryKeysArr]
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
        if (localState.error !== null)
          setLocalState({ success: null, error: null });
        if (DEV_MODE) {
          console.debug("useQueryOnSubmit executing mutation", {
            key: queryKeysArr?.[0],
            url: queryKeysArr?.[1]?.url,
            method: queryKeysArr?.[1]?.method,
          });
        }
        return await mutateAsync(variables);
      } catch (err) {
        // throw new Error(error);
        if ((err as Error).message === "Request completed") {
          return err.cause.success;
        }

        if (DEV_MODE) {
          console.debug("useQueryOnSubmit mutation rejected", err);
        }

        return await err;
      }
    },
    [mutateAsync, localState.error, queryKeysArr]
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
async function onFetch<
  TSuccess extends ResponseInterface,
  TError extends ApiError
>({
  timeout = 1000,
  retry = 3,
  ...fetchArgs
}: FetchArgs): Promise<FetchJSONSuccess<TSuccess>> {
  const { bodyVariables, method, url, abortController, headers } = fetchArgs;

  if (abortController?.signal.aborted) {
    const reason = abortController.signal.reason;

    if (reason) {
      throw reason;
    }

    throw new Error("Request aborted");
  }

  try {
    const response = await fetchJSON<TSuccess, TError>(getUrl(url), {
      method: method,
      json: bodyVariables,
      signal: abortController?.signal,
      headers: headers,
    });

    if (!response.ok || response === undefined) {
      const status = response.status;
      const message = getErrorMessage(status, response, retry);
      throw new Error(message, {
        cause: { ...response },
      });
    }

    return response;
  } catch (error) {
    const err = error as Error;
    const errorCause = {
      message: err.message,
      ...(err.cause as FetchJSONError<TError>),
    };

    if (shouldRetry(errorCause.status, retry)) {
      await wait(timeout);
      return onFetch({
        ...fetchArgs,
        retry: retry - 1,
        timeout: timeout * 2,
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
function onQuerySuccess<TSuccess extends ResponseInterface>(
  response: FetchJSONSuccess<TSuccess>,
  querySuccessDescription?: string
) {
  const successMessage = response.success ?? undefined;
  toast(successMessage ?? "Success", {
    description: querySuccessDescription,
    position: "top-right",
    style: { zIndex: 10000 },
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
  // toast.error(error.error ?? error.message, {
  //   style: { zIndex: 10000 + 1 },
  // });
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
      "Missing url in query descriptor passed to useQueryOnSubmit."
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
