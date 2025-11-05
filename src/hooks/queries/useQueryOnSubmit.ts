import { fetchJSON } from "@/api/api.ts";
import { getErrorMessage } from "@/api/errorFunctions.ts";
import type {
  MutationResponse,
  MutationVariables,
  QueryKeyDescriptor,
} from "@/hooks/queries/types/QueriesTypes.ts";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Handles form submission by triggering the query function.
 *
 * @param queryKey The query key descriptor containing task and descriptor.
 * @returns An object containing data, isLoading, error, and queryFn.
 */
export function useQueryOnSubmit(queryKey: QueryKeyDescriptor) {
  const { url, method = "GET", successDescription } = queryKey[1];

  const { mutateAsync, data, isPending, error } = useMutation<
    MutationResponse,
    Error,
    MutationVariables
  >({
    mutationKey: queryKey,
    mutationFn: async (variables) => {
      const response = await fetchJSON(getUrl(url), {
        method: method,
        json: variables,
      });

      if (!response.ok) {
        const status = response.status;

        const message = getErrorMessage(status, response);

        throw new Error(message, {
          cause: { status, response },
        });
      }

      return response;
    },
    onSuccess: (response) => {
      const successMessage = response.success ?? undefined;
      toast(successMessage ?? "Success", {
        description: successDescription,
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
