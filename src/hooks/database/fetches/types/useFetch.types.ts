import type { QueryKeyDescriptor } from "@/hooks/database/types/QueriesTypes.ts";

/**
 * Parameters for useFetch hook operations.
 */
export type FetchParams = {
  contentId: QueryKeyDescriptor<unknown, unknown>["0"];
  page: number;
  pageSize: number;
  filters: Record<string, unknown>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  dataReshapeFn?: (data, cachedDatas: unknown) => unknown;
} & QueryKeyDescriptor<unknown, unknown>["1"];
