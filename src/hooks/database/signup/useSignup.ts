import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { debugLogs } from "@/configs/app-components.config";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { toast } from "sonner";

/**
 * Signup Hook
 *
 * @description This hook provides a signup function that can be used to register a new user.
 */
export function useSignup() {
  const signup = useAppStore((state) => state.signup);

  return useQueryOnSubmit([
    USER_ACTIVITIES.signup,
    {
      url: API_ENDPOINTS.POST.AUTH.SIGNUP,
      method: API_ENDPOINTS.POST.METHOD,
      successDescription() {
        return {
          type: "success",
          descriptionMessage:
            "Veuillez vérifier votre email pour confirmer votre inscription.",
        };
      },
      onSuccess(data) {
        signup();
        debugLogs("Signup successful:", { type: "auth", data });
      },
      onError(error) {
        if (error.status === 400 || error.status === 401) {
          toast.dismiss();
          toast.error(
            "Il y a eu un problème lors de l'inscription. Veuillez vérifier vos informations et réessayer.",
          );
        }
      },
    },
  ]);
}
