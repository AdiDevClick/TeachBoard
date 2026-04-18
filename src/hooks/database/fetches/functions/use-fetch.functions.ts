import { DEV_MODE } from "@/configs/app.config";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import type { AnyObjectProps } from "@/utils/types/types.utils";
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
  response: AnyObjectProps,
) {
  const { dataReshapeFn, reshapeOptions, contentId } = fetchParams;

  const cachedKey = resolveFetchCacheKey(fetchParams);
  const urlWithParams = cachedKey[1];

  // Get cached data
  const rawCachedDatas = queryClient.getQueriesData({
    queryKey: cachedKey,
  });

  // Reshape/transform the data
  const cachingDatas = dataReshapeFn
    ? dataReshapeFn(response?.data ?? response, rawCachedDatas, reshapeOptions)
    : response?.data;

  // Re-Caching the data under [contentId, url] keys
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

/**
 * Helper function to save fetch results in cache, used for example after a mutation to update the relevant queries with the new data.
 *
 * @param queryClient - The React Query client instance used for caching the data.
 * @param contentId - The content ID used as part of the cache key.
 * @param apiEndpoint - The API endpoint used as part of the cache key.
 * @param dataReshapeFn - An optional function to reshape the data before caching.
 * @param response - The raw response from the API that may need to be reshaped before caching.
 */
export function saveFetchResultInCache(
  queryClient: QueryClient,
  contentId: FetchParams["contentId"],
  apiEndpoint: string,
  dataReshapeFn: FetchParams["dataReshapeFn"],
  objectToSave: AnyObjectProps,
) {
  const fetchParams = {
    contentId,
    cachedFetchKey: [contentId, apiEndpoint],
    dataReshapeFn,
  } as FetchParams;

  return cacheFetchResult(queryClient, fetchParams, objectToSave);
}

/**
 * Helper function to save any object in cache under a specific key, used for example to store selected items that need to be accessed across different pages or components.
 *
 * @description This functions does not use the data reshaping functionality of `cacheFetchResult`.
 *
 * @param queryClient - The React Query client instance used for caching the data.
 * @param cacheKey - The key under which the object should be cached, typically an array containing identifiers related to the content and API endpoint.
 * @param objectToSave - The object that you want to save in the cache, which can be of any shape depending on your needs.
 */
export function saveObjectInCache(
  queryClient: QueryClient,
  cacheKey: [string, string],
  objectToSave: AnyObjectProps,
) {
  queryClient.setQueryData(cacheKey, objectToSave);
}
