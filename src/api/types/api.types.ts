export type fetchJSONOptions = {
  headers?: Partial<Headers>;
  json?: BodyInit | Record<string, unknown> | Array<[string, unknown]>;
  img?: boolean;
  body?: BodyInit;
} & RequestInit;

/** Error object returned on non-OK responses */
export type FetchJSONError<TErrorBody = Record<string, unknown>> = {
  status: Response["status"];
  statusText?: Response["statusText"];
  ok: false;
} & Partial<TErrorBody>;

/** Success object returned on OK responses */
export type FetchJSONSuccess<TData> = {
  ok: true;
} & TData;

/** Wrapper for FetchJSONResult */
export type FetchJSONResult<
  TData extends object = Record<string, unknown>,
  TErrorBody extends object = Record<string, unknown>
> = FetchJSONSuccess<TData> | FetchJSONError<TErrorBody>;
