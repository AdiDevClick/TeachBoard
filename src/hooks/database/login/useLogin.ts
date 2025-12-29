import type {
  AuthLoginError,
  AuthLoginSuccess,
} from "@/api/types/routes/auth.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { toast } from "sonner";

/**
 * Hook for logging in the user.
 */
export function useLogin({ isPwForgotten = false }) {
  const login = useAppStore((state) => state.login);

  const url = isPwForgotten
    ? API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY
    : API_ENDPOINTS.POST.AUTH.LOGIN;

  return useQueryOnSubmit<AuthLoginSuccess, AuthLoginError>([
    USER_ACTIVITIES.login,
    {
      url,
      method: API_ENDPOINTS.POST.METHOD,
      silent: true,
      successDescription: "Vous êtes maintenant connecté(e).",
      onSuccess(data) {
        if (!isPwForgotten) {
          login({
            userId: "data.userId",
            name: "Adi",
            email: "Adi@test.com",
            role: "Student",
            token: "data.token",
            refreshToken: "data.refreshToken",
            avatar: "https://i.pravatar.cc/150?img=3",
          });
        }

        if (import.meta.env.DEV) {
          console.debug("Login onSuccess:", data);
        }
      },
      onError(error) {
        if (error.status === 400 || error.status === 401) {
          toast.dismiss();
          toast.error(
            "Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer."
          );
        }
      },
    },
  ]);
}
