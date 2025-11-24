import { fetchJSON } from "@/api/api.ts";
import { getErrorMessage } from "@/api/errorFunctions.ts";
import {
  type FetchJSONError,
  type FetchJSONSuccess,
} from "@/api/types/api.types";
import type {
  HttpMethod,
  MutationVariables,
  QueryKeyDescriptor,
} from "@/hooks/database/types/QueriesTypes.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";
import { wait } from "@/utils/utils";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";

/**
 * Options for the mutation hook.
 * @description Centralizing mutation functions
 */
const mutationOptions = <S extends ResponseInterface, E extends ApiError>(
  queryKeys: QueryKeyDescriptor<S, E>
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
    abortController,
  } = queryKeys[1];
  // } = queryKeys[1] ?? {};

  return {
    mutationKey: queryKeys,
    mutationFn: (variables) =>
      onFetch<S, E>(
        variables,
        method,
        url,
        3,
        1000,
        abortController as AbortController,
        headers
      ),
    onSuccess: (response) => {
      abortController?.abort(
        new Error("Request completed", { cause: response })
      );
      reset?.();
      onSuccess?.(response);
      if (silent) return;
      onQuerySuccess(response, successDescription);
    },
    onError: (error) => {
      onError?.(error);
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
 * @param queryKeys The query key descriptor containing task and descriptor.
 */
export function useQueryOnSubmit<
  S extends ResponseInterface,
  E extends ApiError
>(queryKeys: QueryKeyDescriptor<S, E>) {
  const { reset } = useQueryErrorResetBoundary();
  const abortControllerRef = useRef(new AbortController());

  queryKeys[1].abortController = abortControllerRef.current;
  queryKeys[1].reset = reset;

  // Memoize mutation options to prevent observer recreation on every render
  const options = useMemo(() => mutationOptions<S, E>(queryKeys), [queryKeys]);

  const { mutateAsync, data, isPending, error } = useMutation(options);

  /**
   * Handles form submission by triggering the mutation function.
   * @description This is a wrapper around mutateAsync to be used as a query function and avoid direct exposure of mutateAsync that triggers side effects.
   *
   * @param variables The variables to be passed to the mutation function.
   */
  const onSubmit = useCallback(
    async (variables: MutationVariables = undefined) => {
      try {
        if (import.meta.env.DEV) {
          console.debug("useQueryOnSubmit executing mutation");
        }
        return await mutateAsync(variables);
      } catch (error) {
        // throw new Error(error);
        if ((error as Error).message === "Request completed") {
          return error.cause.success;
        }
        return await error;
        // Errors are handled via the mutation onError callback.
        if (import.meta.env.DEV) {
          console.debug("useQueryOnSubmit mutation rejected", error);
        }
      }
    },
    [mutateAsync]
  );

  return {
    data,
    isLoading: isPending,
    isLoaded: !!data,
    error,
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
>(
  variables: MutationVariables,
  queryMethod: HttpMethod,
  queryUrl?: string,
  retry = 3,
  timeout = 1000,
  abortController?: AbortController,
  queryHeaders?: Record<string, string>
): Promise<FetchJSONSuccess<TSuccess>> {
  if (abortController?.signal.aborted) {
    return;
  }
  try {
    const response = await fetchJSON<TSuccess, TError>(getUrl(queryUrl), {
      method: queryMethod,
      json: variables,
      signal: abortController?.signal,
      headers: queryHeaders,
    });

    if (!response.ok || response === undefined) {
      const status = response.status;
      const message = getErrorMessage(status, response, retry);
      // throw abortController?.abort(
      //   new Error(message, {
      //     cause: { ...response },
      //   })
      // );
      throw new Error(message, {
        cause: { ...response },
      });
    }

    // At this point response.ok is true, so cast to the success variant
    return response;
  } catch (error) {
    const err = error as Error;
    const errorCause = {
      message: err.message,
      ...(err.cause as FetchJSONError<TError>),
    };

    if (shouldRetry(errorCause.status, retry)) {
      await wait(timeout);
      return onFetch(
        variables,
        queryMethod,
        queryUrl,
        retry - 1,
        timeout,
        abortController
      );
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
  toast.error(error.error ?? error.message, {
    style: { zIndex: 10000 + 1 },
  });
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
