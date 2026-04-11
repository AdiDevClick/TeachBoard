import type {
  FetchJSONError,
  FetchJSONSuccess,
} from "@/api/types/api.types.ts";
import type { USER_ACTIVITIES } from "@/configs/app.config.ts";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import type { QueryClient } from "@tanstack/react-query";
import type { FormMethod } from "react-router-dom";

export type MutationViolation = AnyObjectProps & {
  propertyPath?: string;
  message?: string;
  code?: string;
  invalidValue?: unknown;
};

export type MutationErrorDetails = {
  violations?: MutationViolation[];
} & AnyObjectProps;

export type MutationDebugInfo = AnyObjectProps & {
  type?: string;
  route?: string;
  detailedDebugMessage?: string;
};

export type MutationResponse = AnyObjectProps & {
  ok?: boolean;
  status?: number;
  // error?: string | null;
  success?: string;
  // message?: string;
  // type?: string;
  // details?: MutationErrorDetails;
  // debugs?: MutationDebugInfo;
};

export type MutationVariables = AnyObjectProps | undefined;

export type QueryOnSubmitMutationState = {
  response: MutationResponse;
  error: Error;
  variables: MutationVariables;
};

/**
 * Arguments for fetch function used in queries and mutations.
 */
export type FetchArgs = {
  bodyVariables: MutationVariables;
  method: FormMethod;
  headers?: Headers;
  url?: string;
  abortController?: AbortController;
  retry?: number;
  retryTimeout?: number;
};

export type GenericQueryResults<S, E> = {
  [K in keyof S]: S[K];
} & {
  [K in keyof E]?: E[K];
};

/**
 * Descriptor constructor for query keys used in data fetching and mutations.
 *
 * @template S - Success response type
 * @template E - Error response type
 */
export type QueryKeyDescriptor<TSuccess, TError> = [
  /**
   * A unique string identifier for the query or mutation. This is used as the primary key for caching and identifying the query in React Query.
   */
  task: (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES],
  descriptor: {
    /**
     * The URL endpoint for the API request. This is required to perform the fetch operation.
     */
    url: string;
    /**
     * HTTP method to use for the request (e.g., "GET", "POST", "PUT", "DELETE"). This is optional. @default "GET"
     */
    method?: FormMethod;
    /**
     * Any additional parameters to pass to the query function, such as headers, body, etc.
     */
    headers?: Headers;
    /**
     * The abort controller to use for canceling the request if needed.
     * By default, the mutation function will create its own abort controller to handle internal cancellation logic, but you can provide one if you want to manage cancellation manually.
     */
    abortController?: AbortController;
    /**
     * A saved unique key for caching purposes. This is saved by the useFetch if you use it, but you can also provide it directly if you want to manage caching manually (e.g. for a query that doesn't use useFetch).
     */
    cachedFetchKey?: [string, string];
    /**
     * A description to show in the success toast notification when the query succeeds. This is optional, and if not provided, a default "Success" message will be shown.
     */
    successDescription?: string;
    /**
     * Silence any toaster notification for this query, whether on success or error. Useful for queries that are expected to fail or succeed frequently and where you don't want to spam the user with notifications.
     * This way, you can handle notifications manually in the onSuccess and onError callbacks if needed.
     */
    silent?: boolean;
    /**
     * Whether the query should be enabled or not. This is useful for queries that depend on certain conditions to be met before they can be executed (e.g., waiting for user input, dependent data to be loaded, etc.). @default true
     */
    enabled?: boolean;
    /**
     * Your custom callback for handling successful query responses. This is where you can perform any side effects or state updates based on the successful response data.
     */
    onSuccess?: (data: TSuccess) => void;
    /**
     * Your custom callback for handling query errors. This is where you can perform any side effects or state updates based on the error response.
     */
    onError?: (error: TError) => void;
    /**
     * This will be called on success automatically to reset any previous error state related to this query.
     * You can use this to call your custom error reset logic if needed, for example to clear form errors on a new successful submission.
     * Please, keep in mind that this will override the default error reset logic of useQueryOnSubmit, so if you want to keep that, you need to call the reset function provided in the descriptor inside this onSuccess callback.
     */
    reset?: () => void;
    /**
     * This is a function that allows you to manipulate the React Query cache directly before the fetch is performed
     *
     * @param state - The error and success data, as well as any additional properties you want to include.
     */
    localState?: (
      state: {
        error: TError | null;
        success: TSuccess | null;
      } & AnyObjectProps,
    ) => void;
    /**
     * This is used internally by the useFetch hook when you ask to verify the cache.
     * If you wish to manipulate the cache directly, you can do so externally with onSuccess and onError callbacks.
     */
    queryClient?: QueryClient;
    /**
     * This is the data returned from the cache verification when you set verifyCache to true.
     * You can use this in your onCacheVerify callback to perform any side effects or state updates based on the cached data before the fetch is performed.
     *
     * @param cachedData - The data returned from the cache verification.
     * This will be undefined if no valid cache entry is found.
     */
    onCacheVerify?: (cachedData: unknown) => Promise<any> | void;
  },
];

/**
 * Custom hook for managing fetch operations with React Query.
 */
export type InternalMutationVariables = MutationVariables & {
  abortController?: AbortController;
};

/**
 * Default state for query results, used to reset state on new submissions.
 */
export type UseQueryOnSubmitState<
  TSuccess extends FetchJSONSuccess<any>,
  TError extends FetchJSONError<any>,
> = {
  error: TError | null;
  success: TSuccess | null;
};
