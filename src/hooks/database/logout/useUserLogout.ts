import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { debugLogs } from "@/configs/app-components.config";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler.ts";
import type { UseUserLogoutProps } from "@/hooks/database/logout/types/use-user-logout.types";

/**
 * Hook for logging out the user.
 */
export function useUserLogout({ pageId = "logout" }: UseUserLogoutProps = {}) {
  const logout = useAppStore((state) => state.logout);

  const { submitCallback, data, isLoading, isLoaded, error } =
    useCommandHandler({
      pageId,
      form: null!,
    });

  function handleSubmit() {
    return submitCallback(undefined, {
      endpointUrl: API_ENDPOINTS.POST.AUTH.LOGOUT,
      method: API_ENDPOINTS.POST.METHOD,
      successDescription() {
        return {
          type: "success",
          customSuccessMessage: "Logout successful.",
        };
      },
      onSuccess: (responseData) => {
        logout();
        debugLogs("useUserLogout", {
          type: "all",
          responseData,
          message: "Logout onSuccess",
        });
      },
      onError: (submitError) => {
        debugLogs("useUserLogout", {
          type: "all",
          error: submitError,
          message: "Logout onError",
        });
      },
    });
  }

  return {
    data,
    isLoading,
    onSubmit: handleSubmit,
    isLoaded,
    error,
  };
}
