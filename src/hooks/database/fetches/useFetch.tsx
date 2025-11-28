import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";

export function useFetch(url, contentId) {
  return useQueryOnSubmit([
    contentId,
    {
      method: API_ENDPOINTS.GET.METHOD,
      url: url,
      // silent: true,
      // onSuccess: (response) => {
      //   return response;
      // },
    },
  ]);
}
