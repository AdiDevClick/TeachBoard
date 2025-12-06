import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
type FetchParams = {
  contentId: (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES];
  page: number;
  pageSize: number;
  filters: Record<string, unknown>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  url: string;
  headers?: Headers;
};
const defaultStateParameters: FetchParams = {
  contentId: USER_ACTIVITIES.none,
  page: 1,
  pageSize: 10,
  filters: {},
  sortBy: "",
  sortOrder: "asc",
  url: "",
  headers: undefined,
};

export function useFetch() {
  const [fetchParams, setFetchParams] = useState(defaultStateParameters);
  const queryClient = useQueryClient();
  const queryParams = useQueryOnSubmit([
    fetchParams.contentId,
    {
      method: API_ENDPOINTS.GET.METHOD,
      url: fetchParams.url,
      headers: fetchParams.headers,
      // silent: true,
      onSuccess: (response: any) => {
        // Reshape data for caching
        const cachingDatas = fetchParams.dataReshape
          ? fetchParams.dataReshape(response.data)
          : response.data;

        // Caching under [contentId, url] keys
        queryClient.setQueryData(
          [fetchParams.contentId, fetchParams.url],
          cachingDatas
        );
        // Also update a convenience record with fetchParams metadata if need be
        // for debugging (not used by consumers).
        queryClient.setQueryData(
          [fetchParams.contentId, `${fetchParams.url}:meta`],
          {
            ...fetchParams,
          }
        );
      },
    },
  ]);

  return {
    fetchParams,
    setFetchParams,
    ...queryParams,
  };
}
