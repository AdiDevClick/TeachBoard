import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useAuthMemoryStore } from "@/hooks/store/AuthMemoryStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook to handle password creation process.
 *
 * @description In order to create a password, the user must have a valid signup token stored in memory (in-memory store).
 *
 * @param token The signup token required for password creation.
 *
 * @returns An object containing data, error, isLoading state, and onSubmit function.
 */
export function usePasswordCreation({ token }: { token: string | null }) {
  const navigate = useNavigate();
  const passwordCreation = useAppStore((state) => state.passwordCreation);

  const { data, isLoading, isLoaded, error, onSubmit } = useQueryOnSubmit([
    USER_ACTIVITIES.passwordCreation,
    {
      url: API_ENDPOINTS.POST.AUTH.PASSWORD_CREATION,
      method: API_ENDPOINTS.POST.METHOD,
      headers: {
        Authorization: "Bearer " + token,
      },
      successDescription: "Votre mot de passe a été créé avec succès.",
      onSuccess(data) {
        useAuthMemoryStore.getState().clearSignupToken();
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

  /**
   * @security
   * Make sure the token is present before proceeding
   *
   * @description While this check exists here, it is primarily handled in the PasswordCreation component.
   *
   * This will help avoiding any spam or unwanted requests to the backend endpoint.
   */
  useEffect(() => {
    if (data && isLoaded) {
      navigate("/login", { replace: true });
    }

    if (!data && !token && !isLoading) {
      toast.dismiss();
      toast.error("Session invalide. Veuillez valider votre email à nouveau.");
      navigate("/login", { replace: true });
    }
  }, [token, isLoading, data, isLoaded]);

  return {
    data,
    isLoading,
    isLoaded,
    error,
    onSubmit,
  };
}
