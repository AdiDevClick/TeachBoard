export type fetchJSONOptions = {
  headers?: Partial<Headers>;
  json?: BodyInit | Record<string, unknown> | Array<[string, unknown]>;
  img?: boolean;
  body?: BodyInit;
} & RequestInit;
