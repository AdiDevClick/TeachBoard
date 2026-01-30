import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";

/**
 * Custom hook to check user session.
 *
 * @returns An object containing session check data, loading state, query function, loaded state, and any error encountered.
 */
export function useSessionChecker() {
  const clearUserStateOnError = useAppStore(
    (state) => state.clearUserStateOnError
  );
  const updateSession = useAppStore((state) => state.updateSession);
  return useQueryOnSubmit([
    USER_ACTIVITIES.sessionCheck,
    {
      url: API_ENDPOINTS.POST.AUTH.SESSION_CHECK,
      method: API_ENDPOINTS.POST.METHOD,
      successDescription: "Session checked successfully.",
      silent: true,
      onSuccess: (data) => {
        updateSession(true, USER_ACTIVITIES.sessionCheck);
        if (DEV_MODE) {
          console.debug("Session Check onSuccess:", data);
        }
      },
      onError: (error) => {
        clearUserStateOnError();
        if (DEV_MODE) {
          console.error("Session Check onError:", error);
        }
      },
    },
  ]);
}
