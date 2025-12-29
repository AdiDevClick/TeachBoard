import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  DEV_MODE,
  NO_QUERY_LOGS,
  USER_ACTIVITIES,
} from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { toast } from "sonner";

/**
 * Hook for validating signup email.
 *
 * @param url - The API endpoint URL for signup validation
 */
export function useSignupValidation({ url }: { url: string }) {
  const signupValidation = useAppStore((state) => state.signupValidation);

  return useQueryOnSubmit([
    USER_ACTIVITIES.signupValidation,
    {
      url,
      method: API_ENDPOINTS.GET.METHOD,
      silent: true,
      // successDescription:
      //   "Votre email a été vérifié avec succès. Vous pouvez maintenant créer un mot de passe.",
      onSuccess(data) {
        // await wait(5000);
        signupValidation();
        toast.success(
          "Votre email a été vérifié avec succès. Vous pouvez maintenant créer un mot de passe."
        );
        if (DEV_MODE && !NO_QUERY_LOGS) {
          console.debug("Signup onSuccess:", data);
        }
      },
      onError(error) {
        if (error.status === 400 || error.status === 401) {
          // toast.dismiss();
          toast.error(
            "Il y a eu un problème lors de l'inscription. Veuillez vérifier vos informations et réessayer."
          );
        }
      },
    },
  ]);
}
