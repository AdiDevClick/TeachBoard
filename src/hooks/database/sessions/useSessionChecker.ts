import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE } from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";

export function useSessionChecker() {
  const { openDialog } = useDialog();
  const { data, isLoading, queryFn, isLoaded, error } = useQueryOnSubmit([
    "session-check",
    {
      url: API_ENDPOINTS.POST.AUTH.SESSION_CHECK,
      method: "POST",
      successDescription: "Session checked successfully.",
      silent: true,
      onSuccess: (data) => {
        if (!user.isUserConnected) {
          setUser((prev) => ({
            ...prev,
            isUserConnected: true,
            reloaded: false,
            ...data,
          }));
        }
        if (DEV_MODE) {
          console.debug("Session Check onSuccess:", data);
        }
      },
      onError: (error) => {
        if (DEV_MODE) {
          console.error("Session Check onError:", error);
        }
      },
    },
  ]);

  return { data, isLoading, queryFn, isLoaded, error };
}
