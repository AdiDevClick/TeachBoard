import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { USE_QUERY_DEFAULT_STATE_PARAM } from "@/hooks/database/configs/use-query-on-submit.configs";
import { mutationOptions } from "@/hooks/database/functions/use-query-on-submit.functions";
import type {
  MutationVariables,
  QueryKeyDescriptor,
  UseQueryOnSubmitState,
} from "@/hooks/database/types/QueriesTypes.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";
import { useMutation, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";

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
  const [localState, setLocalState] = useState<UseQueryOnSubmitState<S, E>>(
    USE_QUERY_DEFAULT_STATE_PARAM,
  );
  const abortControllerRef = useRef(new AbortController());

  /**
   * Prepare mutation options based on the provided query keys and descriptor.
   *
   * @see mutationOptions for the structure of the options object.
   *
   * @description This does NOT include the mutation function itself nor the abortController
   */
  const options = useMemo(() => {
    const [key, descriptor] = queryKeysArr;
    const extendedDescriptor = {
      ...descriptor,
      reset,
      localState: (next: UseQueryOnSubmitState<S, E>) => {
        setLocalState(next);
      },
    };

    const newKeys: QueryKeyDescriptor<S, E> = [key, extendedDescriptor];

    return mutationOptions<S, E>(newKeys);
  }, [queryKeysArr, reset]);

  const { mutateAsync, data, isPending, error } = useMutation(options);

  /**
   * MAIN CALL - Handles form submission by triggering the mutation function.
   *
   * @description This is a wrapper around mutateAsync to be used as a query function and avoid direct exposure of mutateAsync that triggers side effects.
   *
   * @param variables The variables to be passed to the mutation function.
   */
  const onSubmit = useCallback(
    async (variables: MutationVariables = undefined) => {
      // !! IMPORTANT !! Reset local error
      // Reset the previous abort controller if it was used
      try {
        if (localState.error !== null)
          setLocalState(USE_QUERY_DEFAULT_STATE_PARAM);

        if (abortControllerRef.current.signal.aborted) {
          abortControllerRef.current = new AbortController();
        }

        // Controller added here to avoid a potential reading of the ref's current value during render, which could cause issues with React's rules of hooks.
        const payload = {
          ...variables,
          abortController: abortControllerRef.current,
        };

        if (DEV_MODE && !NO_QUERY_LOGS) {
          console.debug("useQueryOnSubmit executing mutation", {
            key: queryKeysArr?.[0],
            url: queryKeysArr?.[1]?.url,
            method: queryKeysArr?.[1]?.method,
          });
        }

        return await mutateAsync(payload);
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
