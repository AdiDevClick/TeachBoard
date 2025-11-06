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
  error?: string | null;
  success?: string;
  message?: string;
  type?: string;
  details?: MutationErrorDetails;
  debugs?: MutationDebugInfo;
};

export type MutationVariables = Record<string, unknown>;

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
