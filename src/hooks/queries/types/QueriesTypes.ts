export type MutationResponse = Record<string, unknown> & {
  ok?: boolean;
  status?: number;
  error?: string | null;
  success?: string;
  message?: string;
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
