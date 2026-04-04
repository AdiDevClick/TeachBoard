import { DEV_MODE } from "@/configs/app.config";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ApiSuccess } from "@/types/AppResponseInterface";
import type { QueryClient } from "@tanstack/react-query";
import type { useNavigate } from "react-router-dom";

/**
 * Navigate to a specific page errors.
 *
 * @param status - The HTTP status code.
 * @param navigate - The navigate function from react-router-dom.
 */
export function navigateOnForbiddenError(
  status: number,
  navigate: ReturnType<typeof useNavigate>,
  from?: string,
) {
  if (status === 403) {
    navigate("/login", {
      replace: true,
      state: {
        from: from ?? "/",
      },
    });
  }
}

/**
 * Modify the URL by adding search parameters if they exist in the fetch parameters.
 *
 * @param params - The fetch parameters containing the URL and search parameters.
 *
 * @returns The modified URL with search parameters as query strings if they exist, otherwise the original URL.
 */
export function createSearchParamsEndpoint(params: FetchParams) {
  const { searchParams = {}, url } = params;
  let builtEndpoint = url;
  const entries = Object.entries(searchParams) ?? [];

  if (entries.length !== 0) {
    const createdPath = new URL(url, globalThis.location.origin);

    entries.forEach(([key, value]) => {
      createdPath.searchParams.set(key, String(value));
    });

    builtEndpoint = createdPath.pathname + createdPath.search;
  }

  return builtEndpoint;
}

/**
 * Resolve the canonical React Query cache key for a fetch operation.
 *
 * @description Always uses `cachedFetchKey` when provided, otherwise falls back
 * to `[contentId, urlWithSearchParams]`.
 */
export function resolveFetchCacheKey(fetchParams: FetchParams) {
  const { cachedFetchKey, contentId } = fetchParams;
  const urlWithParams = createSearchParamsEndpoint(fetchParams);

  return cachedFetchKey ?? [contentId, urlWithParams];
}

/**
 * Cache the fetched result in React Query and return the reshaped data.
 *
 * @param queryClient - The React Query client instance used for caching the data.
 * @param fetchParams - The parameters of the fetch operation, including optional data reshaping function and caching key.
 * @param rawData - The raw data returned from the API that may need to be reshaped before caching.
 * @returns - The data that was cached, potentially reshaped by the provided function.
 */
export function cacheFetchResult(
  queryClient: QueryClient,
  fetchParams: FetchParams,
  response: ApiSuccess<any> | ApiError<any>,
) {
  const { dataReshapeFn, reshapeOptions, contentId } = fetchParams;

  const cachedKey = resolveFetchCacheKey(fetchParams);
  const urlWithParams = cachedKey[1];

  const rawCachedDatas = queryClient.getQueriesData({
    queryKey: cachedKey,
  });

  const cachingDatas = dataReshapeFn
    ? dataReshapeFn(response?.data, rawCachedDatas, reshapeOptions)
    : response?.data;

  // Caching under [contentId, url] keys
  queryClient.setQueryData(cachedKey, cachingDatas);
  // Convenience metadata for debug if needed (for example to know what params led to the cached value without having to inspect the network tab)
  if (DEV_MODE) {
    queryClient.setQueryData([contentId, `${urlWithParams}:meta`], {
      ...fetchParams,
      response,
    });
  }

  return cachingDatas;
}
