import { fetchJSON } from "@/api/api";
import { getErrorMessage } from "@/api/errorFunctions";
import type { FetchJSONError, FetchJSONSuccess } from "@/api/types/api.types";
import type {
  FetchArgs,
  InternalMutationVariables,
  QueryKeyDescriptor,
} from "@/hooks/database/types/QueriesTypes";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";
import { wait, waitAndFail } from "@/utils/utils";
import type { UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

const completedControllers = new WeakMap<AbortController, boolean>();

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
 * Get the URL from the query descriptor.
 *
 * @param descriptor Endpoint's string
 * @returns
 */
export function getUrl(url?: string): string {
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
export function shouldRetry(status: number, retry: number): boolean {
  if (typeof status !== "number") {
    return false;
  }

  return retry > 0 && status >= 500;
}

/**
 * Handle query error by showing a toast notification.
 *
 * @description Use this function to centralize error handling logic if needed.
 *
 * @param error The mutation error object.
 */
export function onQueryError<TError extends ApiError>(
  error: FetchJSONError<TError>,
) {
  toast.error(error.message ?? error.error);
}

/**
 * Handle query success by showing a toast notification.
 *
 * @description Use this function to centralize success handling logic if needed.
 *
 * @param response The mutation response object.
 */
export function onQuerySuccess<TSuccess extends ResponseInterface<unknown>>(
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
 * Options for the mutation hook.
 *
 * @description Centralizing mutation behavior for all queries.
 * @remark This calls the actual fetch function and handles retries, errors, and success notifications. @see onFetch
 *
 * @param queryKeysArr An array where the first element is the task identifier string and
 *   the second element is the query descriptor object. @see QueryKeyDescriptor
 */
export const mutationOptions = <
  S extends ResponseInterface<unknown>,
  E extends ApiError,
>(
  queryKeysArr: QueryKeyDescriptor<S, E>,
): UseMutationOptions<
  FetchJSONSuccess<S>,
  FetchJSONError<E>,
  InternalMutationVariables
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
      const { abortController, ...body } = variables;
      const fetchArgs = {
        bodyVariables: method === "GET" ? undefined : body,
        method,
        url,
        headers,
        abortController: abortController,
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
