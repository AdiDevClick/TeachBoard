import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { debugLogs } from "@/configs/app-components.config";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import {
  cacheFetchResult,
  createSearchParamsEndpoint,
  navigateOnForbiddenError,
} from "@/hooks/database/fetches/functions/use-fetch.functions";
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
  searchParams: {},
  url: "",
  headers: undefined,
  method: API_ENDPOINTS.GET.METHOD,
  dataReshapeFn: undefined,
  reshapeOptions: undefined,
  onSuccess: undefined,
  onError: undefined,
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
    contentId,
    ...params
  } = fetchParams;

  /**
   * Build URL with search params if they exist
   */
  const newUrl = createSearchParamsEndpoint(fetchParams);

  const queryParams = useQueryOnSubmit<S, E>([
    contentId,
    {
      ...params,
      cachedFetchKey: fetchParams.cachedFetchKey ?? [contentId, newUrl],
      url: newUrl,
      onSuccess: (response) => {
        setLastUserActivity(contentId, {
          url: pathname,
          endpoint: params.url,
          method: params.method,
          status: response.status,
          type: "useFetch",
        });
        successCallback?.(response);

        // reuse shared caching logic
        const cachingDatas = cacheFetchResult(
          queryClient,
          fetchParams,
          response,
        );

        debugLogs("[useFetch:onSuccess] endpoint:", {
          type: "queryLogs",
          url: fetchParams.url,
          responseData: response.data,
          reshapedResult: cachingDatas,
          message: "Fetch successful",
        });

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

        if (fetchParams.resetParams) {
          resetFetchParams();
        }
      },
      onError: (error) => {
        setLastUserActivity(contentId, {
          url: pathname,
          endpoint: params.url,
          method: params.method,
          type: "useFetch",
          status: error.status,
        });
        errorCallback?.(error);

        if (error?.data !== undefined) {
          const cachedData = cacheFetchResult(queryClient, fetchParams, error);
          // we do not normally expose error data through `viewData`, but
          // having it available can be handy for callers that treat the
          // cached value as authoritative.
          setViewData(cachedData as TViewData);

          debugLogs("[useFetch:onError] endpoint:", {
            type: "queryLogs",
            url: fetchParams.url,
            responseData: error.data,
            reshapedResult: cachedData,
            message: error.message,
          });
        }

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
    serverData: queryParams.data?.data,
    // Quick access to reshaped data.
    data: viewData,
  };
}
