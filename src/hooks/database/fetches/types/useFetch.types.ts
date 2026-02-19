import type { QueryKeyDescriptor } from "@/hooks/database/types/QueriesTypes.ts";
import type { DataReshapeFn } from "@/types/AppInputControllerInterface";

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
  cachedFetchKey?: [string, string];
  dataReshapeFn?: DataReshapeFn;
  reshapeOptions?: unknown;
} & QueryKeyDescriptor<unknown, unknown>["1"];
