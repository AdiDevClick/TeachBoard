import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
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
      url: API_ENDPOINTS.POST.AUTH.REGISTER,
      method: API_ENDPOINTS.POST.METHOD,
      successDescription:
        "Veuillez vérifier votre email pour confirmer votre inscription.",
      onSuccess(data) {
        signup();
        // userId: "data.userId",
        // name: "Adi",
        // email: "Adi@test.com",
        // role: "Student",
        // token: "data.token",
        // refreshToken: "data.refreshToken",
        // avatar: "https://i.pravatar.cc/150?img=3",
        // });
        if (import.meta.env.DEV) {
          console.debug("Signup onSuccess:", data);
        }
      },
      onError(error) {
        if (error.status === 400 || error.status === 401) {
          toast.dismiss();
          toast.error(
            "Il y a eu un problème lors de l'inscription. Veuillez vérifier vos informations et réessayer."
          );
        }
      },
    },
  ]);
}
