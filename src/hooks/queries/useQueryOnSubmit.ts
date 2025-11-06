import { fetchJSON } from "@/api/api.ts";
import { getErrorMessage } from "@/api/errorFunctions.ts";
import type {
  MutationResponse,
  MutationVariables,
  QueryKeyDescriptor,
} from "@/hooks/queries/types/QueriesTypes.ts";
import type { ApiError, CustomError } from "@/types/MainTypes.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Options for the mutation hook.
 * @description Centralizing mutation functions
 */
const mutationOptions = (
  queryKeys: QueryKeyDescriptor
): UseMutationOptions<
  MutationResponse,
  CustomError<ApiError>,
  MutationVariables
> => {
  const { url, method = "GET", successDescription } = queryKeys[1];

  return {
    mutationKey: queryKeys,
    mutationFn: (variables) => onFetch(variables, method, url),
    onSuccess: (response) => onQuerySuccess(response, successDescription),
    onError: (error) => onQueryError(error),
  };
};

/**
 * Handles form submission by triggering the query function.
 *
 * @param queryKeys The query key descriptor containing task and descriptor.
 * @returns An object containing data, isLoading, error, and queryFn.
 */
export function useQueryOnSubmit(queryKeys: QueryKeyDescriptor) {
  const { mutateAsync, data, isPending, error } = useMutation(
    mutationOptions(queryKeys)
  );

  /**
   * Handles form submission by triggering the mutation function.
   * @description This is a wrapper around mutateAsync to be used as a query function and avoid direct exposure of mutateAsync that triggers side effects.
   *
   * @param variables The variables to be passed to the mutation function.
   */
  const queryFn = useCallback(
    async (variables: MutationVariables) => {
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
async function onFetch(
  variables: MutationVariables,
  queryMethod: string,
  queryUrl?: string
) {
  const response = await fetchJSON(getUrl(queryUrl), {
    method: queryMethod,
    json: variables,
  });

  if (!response.ok || response === undefined) {
    const status = response.status;
    const message = getErrorMessage(status, response);
    const apiError = new Error(message, {
      cause: { status, response },
    });
    // }) as CustomError<ApiError>;

    throw apiError;
  }

  return response;
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
 * Handle query success by showing a toast notification.
 *
 * @description Use this function to centralize success handling logic if needed.
 *
 * @param response The mutation response object.
 */
function onQuerySuccess(
  response: MutationResponse,
  querySuccessDescription?: string
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
function onQueryError(error: CustomError<ApiError>) {
  toast.error(error.message);
}
