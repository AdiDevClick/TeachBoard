import type { ApiError } from "@/types/AppErrorInterface.ts";
import type { ResponseInterface } from "@/types/AppResponseInterface.ts";
import type { CustomError } from "@/types/MainTypes.ts";

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

export type QueryKeyDescriptor = [
  task: string | null,
  descriptor: {
    url?: string;
    method?: HttpMethod;
    successDescription?: string;
  } & Record<string, unknown>
];

export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
  "CONNECT",
  "TRACE",
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export type GenericQueryResults<S, E> = {
  [K in keyof S]: S[K];
} & {
  [K in keyof E]?: E[K];
};

type GenericSuccess<T extends ResponseInterface> = T;
type GenericError<T extends ApiError> = T;

export interface QueryHookInterface<
  S extends ResponseInterface,
  E extends ApiError
> {
  mutateAsync: (
    variables: MutationVariables
  ) => Promise<GenericQueryResults<S, E>>;
  data: GenericQueryResults<S, E> | undefined;
  isPending: boolean;
  error?: CustomError<E>;
}

// export interface QueryHookReturn<
//   S extends ResponseInterface,
//   E extends ApiError
// > {
//   queryFn: QueryHookInterface<S, E>["mutateAsync"];
//   data: QueryHookInterface<S, E>["data"];
//   isLoading: QueryHookInterface<S, E>["isPending"];
//   error: QueryHookInterface<S, E>["error"];
// }
