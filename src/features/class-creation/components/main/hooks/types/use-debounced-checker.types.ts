/**
 * Keeps the last value that produced an availability error and, when
 * available, the field key / error object
 */
export type lastErrorType = {
  value?: string;
  errorValue?: string;
  errorKey?: string;
  error?: { type: string; message: string } | null;
} | null;
