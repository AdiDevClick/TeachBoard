export interface ResponseInterface<TData = Record<string, unknown>> {
  status: number;
  success: string;
  ok: boolean;
  data: TData;
}
