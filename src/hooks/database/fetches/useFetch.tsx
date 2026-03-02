import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  DEV_MODE,
  NO_QUERY_LOGS,
  USER_ACTIVITIES,
} from "@/configs/app.config.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type { ApiSuccess } from "@/types/AppResponseInterface";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const defaultStateParameters: FetchParams = {
  contentId: USER_ACTIVITIES.none,
  page: 1,
  pageSize: 10,
  filters: {},
  sortBy: "",
  sortOrder: "asc",
  url: "",
  headers: undefined,
  method: API_ENDPOINTS.GET.METHOD,
  dataReshapeFn: undefined,
  reshapeOptions: undefined,
  onSuccess: undefined,
  onError: undefined,
  silent: false,
  cachedFetchKey: undefined,
  resetParams: false,
};

/**
 * A hook to fetch data from an API endpoint with various parameters.
 *
 * @description Cached data is stored using React Query under the keys `[contentId, url]`.
 * Data reshaping can be applied using a provided function before caching.
 *
 * @see {@link API_ENDPOINTS} for predefined API endpoints and their configurations and how to use the reshaper.
 * @see {@link FetchParams} for the structure of fetch parameters.
 * @see {@link useQueryOnSubmit} for query handling on fetch submission.
 * @see {@link useAppStore} for accessing global app state like user activity and navigation.
 *
 * @remarks !! IMPORTANT !! This hook handles user activity tracking and redirects to login on 403 errors.
 *
 * @param fetchParams - The parameters for the fetch operation
 * @param setFetchParams - A function to set the fetch parameters
 * @param isLoaded - A boolean indicating if the data has been loaded
 * @param error - An error object if the fetch operation failed
 * @param data - The fetched data
 * @param isLoading - A boolean indicating if the fetch operation is in progress
 *
 * @returns An object containing fetch parameters, a function to set them, and query status.
 */
export function useFetch<
  S extends ApiSuccess = ApiSuccess<any>,
  E extends ApiError = ApiError,
  TViewData = S extends { data: infer M } ? M : never,
>() {
  const [fetchParams, setFetchParams] = useState(defaultStateParameters);
  const [viewData, setViewData] = useState<TViewData | undefined>(undefined);
  const setLastUserActivity = useAppStore((state) => state.setLastUserActivity);
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const queryClient = useQueryClient();
  const {
    onSuccess: successCallback,
    onError: errorCallback,
    cachedFetchKey,
    contentId,
    ...params
  } = fetchParams;

  let newUrl = params.url;
  /**
   * Build URL with filters params if they exist
   */
  if (Object.entries(params.filters).length !== 0) {
    const createdPath = new URL(params.url, window.location.origin);

    Object.entries(params.filters ?? {}).forEach(([key, value]) => {
      createdPath.searchParams.set(key, String(value));
    });

    newUrl = createdPath.pathname + createdPath.search;
  }
  const queryParams = useQueryOnSubmit<S, E>([
    contentId,
    {
      ...params,
      url: newUrl,
      onSuccess: (response) => {
        setLastUserActivity(contentId, {
          url: pathname,
          endpoint: params.url,
          method: params.method,
          type: "fetch",
        });
        successCallback?.(response);

        const cachedKey = cachedFetchKey ?? [contentId, params.url];

        // Reshape data for caching
        const rawCachedDatas = queryClient.getQueriesData({
          queryKey: cachedKey,
        });

        const cachingDatas = fetchParams.dataReshapeFn
          ? fetchParams.dataReshapeFn(
              response.data,
              rawCachedDatas,
              fetchParams.reshapeOptions,
            )
          : response.data;

        if (DEV_MODE && !NO_QUERY_LOGS) {
          console.debug(
            "[useFetch:onSuccess] endpoint:",
            fetchParams.url,
            "response.data:",
            response.data,
            "rawCachedDatas:",
            rawCachedDatas,
            "reshapedResult:",
            cachingDatas,
          );
        }

        setViewData(cachingDatas as TViewData);

        // `cachingDatas` can be any shape (depends on the optional reshaper)
        const maybeItems = (cachingDatas as { items?: unknown })?.items;
        const isEmptyItemsCount = maybeItems === 0;
        const isEmptyItemsArray =
          Array.isArray(maybeItems) && maybeItems.length === 0;

        if (isEmptyItemsCount || isEmptyItemsArray) {
          toast.dismiss();
          toast.info("Aucune donnée disponible. \nCréez-en une nouvelle !", {
            style: { whiteSpace: "pre-wrap", zIndex: 10001 },
          });
        }

        // Caching under [contentId, url] keys
        queryClient.setQueryData(cachedKey, cachingDatas);
        // Also update a convenience record with fetchParams metadata if need be
        // for debugging (not used by consumers).
        queryClient.setQueryData(
          [fetchParams.contentId, `${fetchParams.url}:meta`],
          {
            ...fetchParams,
          },
        );

        if (fetchParams.resetParams) {
          resetFetchParams();
        }
      },
      onError: (error) => {
        setLastUserActivity(contentId, {
          url: pathname,
          endpoint: params.url,
          method: params.method,
          type: "fetch",
        });
        errorCallback?.(error);

        // !! IMPORTANT !! Handle forbidden error by navigating to login page
        navigateOnForbiddenError(error.status, navigate);
      },
    },
  ]);

  const resetFetchParams = () => {
    setFetchParams(defaultStateParameters);
    setViewData(undefined);
  };

  return {
    fetchParams,
    setFetchParams,
    resetFetchParams,
    ...queryParams,
    // raw server response.
    response: queryParams.data,
    // Convenience shortcut for `response.data` (not all responses have this).
    serverData: queryParams.data?.data as TViewData | undefined,
    // // Quick access to reshaped data.
    data: viewData,
  };
}

/**
 * Navigate to a specific page errors.
 *
 * @param status - The HTTP status code.
 * @param navigate - The navigate function from react-router-dom.
 */
function navigateOnForbiddenError(
  status: number,
  navigate: ReturnType<typeof useNavigate>,
) {
  if (status === 403) {
    navigate("/login", { replace: true });
  }
}
