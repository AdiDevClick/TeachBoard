import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useClassCreation() {
  const navigate = useNavigate();
  // const clearUser = useAppStore((state) => state.clearUser);
  const setLastUserActivity = useAppStore((state) => state.setLastUserActivity);

  return useQueryOnSubmit([
    USER_ACTIVITIES.classCreation,
    {
      url: API_ENDPOINTS.POST.CREATE_CLASS,
      method: API_ENDPOINTS.POST.METHOD,
      successDescription: "Class created successfully.",
      // silent: true,
      onSuccess(data) {
        setLastUserActivity(USER_ACTIVITIES.classCreation);
        // if (data?.data.length === 0) {
        //   toast.dismiss();
        //   toast.info("Aucune classe disponible. \nCréez-en une nouvelle !", {
        //     style: { whiteSpace: "pre-wrap", zIndex: 10001 },
        //   });
        // }
      },
      onError(error) {
        setLastUserActivity(USER_ACTIVITIES.classCreation);
        if (error.status === 403) {
          navigate("/login", { replace: true });
          // clearUser();
          toast.dismiss();
          toast.error(
            `Vous n'avez pas la permission d'accéder à cette ressource. \nVeillez à être connecté avec un compte disposant des droits nécessaires.`,
            { style: { whiteSpace: "pre-wrap" } }
          );
        }
      },
    },
  ]);
}
