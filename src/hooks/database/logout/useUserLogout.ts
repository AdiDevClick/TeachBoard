import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";

/**
 * Hook for logging out the user.
 */
export function useUserLogout() {
  const logout = useAppStore((state) => state.logout);

  const { data, isLoading, queryFn, isLoaded, error } = useQueryOnSubmit([
    USER_ACTIVITIES.logout,
    {
      url: API_ENDPOINTS.POST.AUTH.LOGOUT,
      method: API_ENDPOINTS.POST.METHOD,
      successDescription: "Logout successful.",
      // silent: true,
      onSuccess: (data) => {
        logout();
        if (DEV_MODE) {
          console.debug("Logout onSuccess:", data);
        }
      },
      onError: (error) => {
        if (DEV_MODE) {
          console.error("Logout onError:", error);
        }
      },
    },
  ]);

  return {
    data,
    isLoading,
    queryFn,
    isLoaded,
    error,
  };
}
