import type { ApiError } from "@/types/AppErrorInterface";
import type { ApiSuccess } from "@/types/AppResponseInterface";
import type { AnyObjectProps } from "@/utils/types/types.utils";

export type FetchJSONOptions = {
  headers?: Partial<Headers>;
  json?: BodyInit | AnyObjectProps | Array<[string, unknown]>;
  img?: boolean;
  body?: BodyInit;
} & RequestInit;

/** Error object returned on non-OK responses */
export type FetchJSONError<TErrorBody extends ApiError> = {
  ok: false;
  statusText: string;
} & TErrorBody;

/** Success object returned on OK responses */
export type FetchJSONSuccess<TSuccessBody extends ApiSuccess> = {
  ok: true;
  // statusText: never;
} & TSuccessBody;

/** Wrapper for FetchJSONResult */
export type FetchJSONResult<
  TSuccessBody extends ApiSuccess<any> = ApiSuccess<any>,
  TErrorBody extends ApiError = ApiError,
> = FetchJSONSuccess<TSuccessBody> | FetchJSONError<TErrorBody>;
