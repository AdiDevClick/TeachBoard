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
} from "@/hooks/queries/types/QueriesTypes.ts";
import { wait } from "@/lib/utils.ts";
import type { ApiError } from "@/types/AppErrorInterface.ts";
import type { ResponseInterface } from "@/types/AppResponseInterface.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Options for the mutation hook.
 * @description Centralizing mutation functions
 */
const mutationOptions = <S extends ResponseInterface, E extends ApiError>(
  queryKeys: QueryKeyDescriptor
): UseMutationOptions<
  FetchJSONSuccess<S>,
  FetchJSONError<E>,
  MutationVariables
> => {
  const { url, method = "GET", successDescription } = queryKeys[1];

  return {
    mutationKey: queryKeys,
    mutationFn: (variables) => onFetch<S, E>(variables, method, url),
    onSuccess: (response) => onQuerySuccess(response, successDescription),
    onError: (error) => onQueryError<E>(error),
  };
};

/**
 * Handles form submission by triggering the query function.
 *
 * @param queryKeys The query key descriptor containing task and descriptor.
 */
export function useQueryOnSubmit<
  S extends ResponseInterface,
  E extends ApiError
>(queryKeys: QueryKeyDescriptor) {
  const { mutateAsync, data, isPending, error } = useMutation(
    mutationOptions<S, E>(queryKeys)
  );

  /**
   * Handles form submission by triggering the mutation function.
   * @description This is a wrapper around mutateAsync to be used as a query function and avoid direct exposure of mutateAsync that triggers side effects.
   *
   * @param variables The variables to be passed to the mutation function.
   */
  const queryFn = useCallback(
    async (variables: MutationVariables = undefined) => {
      try {
        await mutateAsync(variables);
      } catch (error) {
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
    queryFn,
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
  timeout = 1000
): Promise<FetchJSONSuccess<TSuccess>> {
  try {
    const response = await fetchJSON<TSuccess, TError>(getUrl(queryUrl), {
      method: queryMethod,
      json: variables,
    });

    if (!response.ok || response === undefined) {
      const status = response.status;
      const message = getErrorMessage(status, response, retry);

      throw new Error(message, {
        cause: { ...response },
      });
    }

    // At this point response.ok is true, so cast to the success variant
    return response;
  } catch (error) {
    const errorCause = (error as Error).cause as FetchJSONError<TError>;

    if (shouldRetry(errorCause.status, retry)) {
      await wait(timeout);
      return onFetch(variables, queryMethod, queryUrl, retry - 1);
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
  toast.error(error.error, {
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
