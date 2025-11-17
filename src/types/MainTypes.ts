import type { FetchJSONError } from "@/api/types/api.types";

/* Root component props */
export type RootProps = {
  contentType?: "error";
};

/** Error object containing the backend payload */
export type CustomError<T extends object = Record<string, unknown>> =
  Error & FetchJSONError<T>;
