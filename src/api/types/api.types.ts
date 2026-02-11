import type { AnyObjectProps } from "@/utils/types/types.utils";

export type fetchJSONOptions = {
  headers?: Partial<Headers>;
  json?: BodyInit | AnyObjectProps | Array<[string, unknown]>;
  img?: boolean;
  body?: BodyInit;
} & RequestInit;

/** Error object returned on non-OK responses */
export type FetchJSONError<TErrorBody = AnyObjectProps> = {
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
  TData extends object = AnyObjectProps,
  TErrorBody extends object = AnyObjectProps,
> = FetchJSONSuccess<TData> | FetchJSONError<TErrorBody>;
