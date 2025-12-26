import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
};

/**
 * A hook to fetch data from an API endpoint with various parameters.
 *
 * @description Cached data is stored using React Query under the keys `[contentId, url]`.
 * Data reshaping can be applied using a provided function before caching.
 *
 * @see {@link api.endpoints.config.ts} for predefined API endpoints and their configurations and how to use the reshaper.
 * @see {@link FetchParams} for the structure of fetch parameters.
 * @see {@link useQueryOnSubmit} for query handling on fetch submission.
 * @see {@link useAppStore} for accessing global app state like user activity and navigation.
 *
 * @remarks This hook handles user activity tracking and redirects to login on 403 errors.
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
export function useFetch() {
  const [fetchParams, setFetchParams] = useState(defaultStateParameters);
  const clearUser = useAppStore((state) => state.clearUser);
  const setLastUserActivity = useAppStore((state) => state.setLastUserActivity);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    onSuccess: successCallback,
    onError: errorCallback,
    cachedFetchKey,
    contentId,
    ...params
  } = fetchParams;

  const queryParams = useQueryOnSubmit([
    contentId,
    {
      ...params,
      onSuccess: (response: any) => {
        setLastUserActivity(contentId);
        successCallback?.(response);

        const cachedKey = cachedFetchKey ?? [contentId, params.url];

        // Reshape data for caching
        const cachingDatas = fetchParams.dataReshapeFn
          ? fetchParams.dataReshapeFn(
              response.data,
              queryClient.getQueriesData({ queryKey: cachedKey }),
              fetchParams.reshapeOptions
            )
          : response.data;

        if (cachingDatas.items === 0) {
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
          }
        );
      },
      onError: (error) => {
        setLastUserActivity(contentId);
        errorCallback?.(error);

        if (error.status === 403) {
          navigate("/login", { replace: true });
          // clearUser();
          toast.dismiss();
          toast.error(
            `Vous n'avez pas la permission d'accéder à cette ressource. \nVeillez à être connecté avec un compte disposant des droits nécessaires.`,
            { style: { whiteSpace: "pre-wrap" } }
          );
        }
      },
    },
  ]);

  return {
    fetchParams,
    setFetchParams,
    ...queryParams,
  };
}
