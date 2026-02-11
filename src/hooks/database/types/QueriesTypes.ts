import type {
  FetchJSONError,
  FetchJSONSuccess,
} from "@/api/types/api.types.ts";
import type { USER_ACTIVITIES } from "@/configs/app.config.ts";
import type { AnyObjectProps } from "@/utils/types/types.utils";
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
  timeout?: number;
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
export type QueryKeyDescriptor<S, E> = [
  task: (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES],
  descriptor: {
    url: string;
    method?: FormMethod;
    headers?: Headers;
    abortController?: AbortController;
    successDescription?: string;
    silent?: boolean;
    onSuccess?: (data: FetchJSONSuccess<S>) => void;
    onError?: (error: FetchJSONError<E>) => void;
    reset?: () => void;
    localState?: (
      state: {
        error: FetchJSONError<E> | null;
        success: FetchJSONSuccess<S> | null;
      } & AnyObjectProps,
    ) => void;
  },
];
