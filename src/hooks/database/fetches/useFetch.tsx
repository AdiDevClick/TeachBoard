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
  onSuccess: undefined,
  onError: undefined,
  silent: false,
  cachedFetchKey: undefined,
};

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
              queryClient.getQueriesData({ queryKey: cachedKey })
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
function mergeDatas(
  oldArray: any[],
  newMappedItem,
  response: any,
  originData: any
) {
  if (!oldArray) return originData;

  if (!Array.isArray(oldArray)) return response;

  if (!newMappedItem.id || !newMappedItem.value) {
    console.error("Failed to map new item, data structure:", originData);
    return oldArray;
  }

  // Append the item to the first group if present
  const newGroups = [
    { ...oldArray[0], items: [...oldArray[0].items, newMappedItem] },
  ];
  return newGroups;
}
