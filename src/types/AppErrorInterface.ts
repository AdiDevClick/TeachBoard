/** Detailed validation violation coming from the backend */
export type ValidationViolation = [
  field: string,
  message: string,
  invalidValue?: unknown,
  code?: string
][number];

/** Common properties shared by every API error */
export interface ErrorInterface {
  status: number;
  error?: string;
}

/** Optional metadata present on most errors */
export type ErrorMeta = {
  message?: string;
  /** Generic error `type` sometimes returned by backend (e.g. 'An unexpected error occurred...') */
  type?: string;
  // errorId?: string;
  route?: string;
  // timestamp?: string;
};

/** Validation error details payload */
export type ValidationErrorDetails = {
  summary?: string;
  violations: ValidationViolation[];
} & Record<string, unknown>;

/** Server-side debug information (500 range) */
export type ServerErrorDebugs = {
  severity?: string;
  traceId?: string;
  clientRemoteType?: string;
  clientIP?: string;
  clientCookies?: string;
  detailedDebugMessage?: string;
  type?: string;
  status: number;
} & Record<string, unknown>;

/** Specific error contracts mapped to HTTP status codes */
export type ValidationError = ErrorInterface &
  ErrorMeta & {
    status: 400;
    details: ValidationErrorDetails;
  };

export type UnauthorizedError = ErrorInterface &
  ErrorMeta & {
    status: 401;
  };

export type ForbiddenError = ErrorInterface &
  ErrorMeta & {
    status: 403;
  };

export type NotFoundError = ErrorInterface &
  ErrorMeta & {
    status: 404;
  };

export type ConflictError = ErrorInterface &
  ErrorMeta & {
    status: 409;
  };

export type ServerError = ErrorInterface &
  ErrorMeta & {
    status: 500;
    debugs?: ServerErrorDebugs;
  };

/** Fallback error shape when the backend returns an unexpected payload */
export type GenericApiError = ErrorInterface &
  Partial<ErrorMeta> & {
    details?: Record<string, unknown>;
    debugs?: Record<string, unknown>;
    // response?: unknown;
  };

export type KnownApiError =
  | ValidationError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError
  | ConflictError
  | ServerError;

export type ApiError = KnownApiError | GenericApiError;
