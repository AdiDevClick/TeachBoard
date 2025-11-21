import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { DEV_MODE, USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { toast } from "sonner";

export function useSignupValidation({
  urlParams,
}: {
  urlParams: Record<string, string | undefined>;
}) {
  const signupValidation = useAppStore((state) => state.signupValidation);

  return useQueryOnSubmit([
    USER_ACTIVITIES.signupValidation,
    {
      url:
        API_ENDPOINTS.GET.AUTH.SIGNUP_VALIDATION +
        `${urlParams.referral}/${urlParams.referralCode}`,
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
        if (DEV_MODE) {
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
