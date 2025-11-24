import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { toast } from "sonner";

/**
 * Hook to handle password creation process.
 *
 * @description In order to create a password, the user must have a valid signup token stored in sessionStorage.
 *
 * @returns An object containing data, error, isLoading state, and onSubmit function.
 */
export function usePasswordCreation() {
  const passwordCreation = useAppStore((state) => state.passwordCreation);
  const token = sessionStorage.getItem("signup_token") ?? "";

  return useQueryOnSubmit([
    USER_ACTIVITIES.passwordCreation,
    {
      url: API_ENDPOINTS.POST.AUTH.PASSWORD_CREATION,
      method: API_ENDPOINTS.POST.METHOD,
      headers: {
        Authorization: "Bearer " + token,
      },
      successDescription: "Votre mot de passe a été créé avec succès.",
      onSuccess(data) {
        sessionStorage.removeItem("signup_token");
        passwordCreation();
        if (DEV_MODE) {
          console.debug("PasswordCreation onSuccess:", data);
        }
      },
      onError(error) {
        if (error.status === 400 || error.status === 401) {
          toast.dismiss();
          toast.error(
            "Il y a eu un problème lors de la création du mot de passe. Veuillez réessayer."
          );
        }
      },
    },
  ]);
}
