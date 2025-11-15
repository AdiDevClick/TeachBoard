import type {
  FetchJSONError,
  FetchJSONSuccess,
} from "@/api/types/api.types.ts";
import type { HTTP_METHODS, USER_ACTIVITIES } from "@/configs/app.config.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ResponseInterface } from "@/types/AppResponseInterface";

export type MutationViolation = Record<string, unknown> & {
  propertyPath?: string;
  message?: string;
  code?: string;
  invalidValue?: unknown;
};

export type MutationErrorDetails = {
  violations?: MutationViolation[];
} & Record<string, unknown>;

export type MutationDebugInfo = Record<string, unknown> & {
  type?: string;
  route?: string;
  detailedDebugMessage?: string;
};

export type MutationResponse = Record<string, unknown> & {
  ok?: boolean;
  status?: number;
  // error?: string | null;
  success?: string;
  // message?: string;
  // type?: string;
  // details?: MutationErrorDetails;
  // debugs?: MutationDebugInfo;
};

export type MutationVariables = Record<string, unknown> | undefined;

export type QueryOnSubmitMutationState = {
  response: MutationResponse;
  error: Error;
  variables: MutationVariables;
};

export type HttpMethod = (typeof HTTP_METHODS)[number];

export type GenericQueryResults<S, E> = {
  [K in keyof S]: S[K];
} & {
  [K in keyof E]?: E[K];
};

export type QueryKeyDescriptor<S, E> = [
  task: (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES],
  descriptor: {
    url: string;
    method?: HttpMethod;
    successDescription?: string;
    silent?: boolean;
    onSuccess?: (data: FetchJSONSuccess<S>) => void;
    onError?: (error: FetchJSONError<E>) => void;
    reset?: () => void;
  } & Record<string, unknown>
];

// export interface QueryHookInterface<
//   S extends ResponseInterface,
//   E extends ApiError
// > {
//   mutateAsync: (
//     variables: MutationVariables
//   ) => Promise<GenericQueryResults<S, E>>;
//   data: GenericQueryResults<S, E> | undefined;
//   isPending: boolean;
//   error?: CustomError<E>;
// }

// export interface QueryHookReturn<
//   S extends ResponseInterface,
//   E extends ApiError
// > {
//   queryFn: QueryHookInterface<S, E>["mutateAsync"];
//   data: QueryHookInterface<S, E>["data"];
//   isLoading: QueryHookInterface<S, E>["isPending"];
//   error: QueryHookInterface<S, E>["error"];
// }
