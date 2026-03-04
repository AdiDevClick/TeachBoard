import type { FetchJSONError, FetchJSONSuccess } from "@/api/types/api.types";
import type { QueryKeyDescriptor } from "@/hooks/database/types/QueriesTypes.ts";
import type { DataReshapeFn } from "@/types/AppInputControllerInterface";

/**
 * SearchParams for your query
 *
 * Define here any additional parameters you want to use for your query, such as pagination, filters, sorting, etc.
 */
export type SearchParams = {
  by?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: string;
};

/**
 * Parameters for useFetch hook operations.
 */
export type FetchParams<
  S extends FetchJSONSuccess<any> = FetchJSONSuccess<any>,
  E extends FetchJSONError<any> = FetchJSONError<any>,
> = {
  contentId: QueryKeyDescriptor<S, E>["0"];
  searchParams: SearchParams;
  dataReshapeFn?: DataReshapeFn;
  reshapeOptions?: unknown;
  resetParams?: boolean;
} & Omit<QueryKeyDescriptor<S, E>["1"], "queryClient">;
