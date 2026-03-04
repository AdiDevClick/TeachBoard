import type { AnyObjectProps } from "@/utils/types/types.utils";

/** Detailed validation violation coming from the backend */
export type ValidationViolation = [
  field: string,
  message: string,
  invalidValue?: unknown,
  code?: string,
][number];

type ClientCookies = [
  {
    fromUserAgent: boolean;
    changed: boolean;
    sameSite: string;
    name: string;
    value: string;
    path: string;
    domain: string;
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
  },
];

type ClientRemoteType = {
  domainSocket: boolean;
  inetSocket: boolean;
};

/** Common properties shared by every API error */
export interface ErrorInterface<TStatus extends number = number> {
  status: TStatus;
  error?: string;
  type?: string;
}

/** Validation error details payload */
export type ValidationErrorDetails = {
  summary?: string;
  violations: ValidationViolation[];
} & AnyObjectProps;

/** Server-side debug information (500 range) */
export type ServerErrorDebugs = {
  severity?: string;
  clientRemoteType?: ClientRemoteType;
  clientIP?: string;
  clientCookies?: ClientCookies;
  detailedDebugMessage?: string;
  detailedMessage?: string;
  type?: string;
  status: 500;
  route?: string;
} & AnyObjectProps;

/** Specific error contracts mapped to HTTP status codes */
export type ValidationError = ErrorInterface<400> & {
  details: ValidationErrorDetails;
};

export type UnauthorizedError = ErrorInterface<401>;

export type ForbiddenError = ErrorInterface<403>;

export type NotFoundError = ErrorInterface<404>;

export type ConflictError = ErrorInterface<409> & {
  data?: {
    available?: false;
  };
};

export type ServerError = ErrorInterface<500> & {
  debugs: ServerErrorDebugs;
  details: ValidationErrorDetails;
};

export type KnownApiError =
  | ValidationError
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError
  | ConflictError
  | ServerError;

export type ApiError<TMeta extends object = Record<string, never>> =
  KnownApiError & Partial<TMeta>;
