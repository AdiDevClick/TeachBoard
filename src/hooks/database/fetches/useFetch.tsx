import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
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

  const queryParams = useQueryOnSubmit([
    fetchParams.contentId,
    {
      method: API_ENDPOINTS.GET.METHOD,
      url: fetchParams.url,
      headers: fetchParams.headers,
      // silent: true,
      // onSuccess: (response) => {
      //   return response;
      // },
    },
  ]);

  return {
    fetchParams,
    setFetchParams,
    ...queryParams,
  };
}
