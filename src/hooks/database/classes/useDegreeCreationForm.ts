import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useDegreeCreationForm(id: "LEVEL" | "YEAR" | "FIELD") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const clearUser = useAppStore((state) => state.clearUser);
  const setLastUserActivity = useAppStore((state) => state.setLastUserActivity);

  return useQueryOnSubmit([
    USER_ACTIVITIES.degreeCreation,
    {
      url: API_ENDPOINTS.POST.CREATE_DEGREE[id],
      method: API_ENDPOINTS.POST.METHOD,
      successDescription: "Degree created successfully.",
      // silent: true,
      onSuccess(data) {
        setLastUserActivity(USER_ACTIVITIES.degreeCreation);
        // if (data?.data.length === 0) {
        //   toast.dismiss();
        //   toast.info("Aucune classe disponible. \nCréez-en une nouvelle !", {
        //     style: { whiteSpace: "pre-wrap", zIndex: 10001 },
        //   });
        // }
        // 1) Compose la même clé que celle utilisée pour GET (exemple) :
        const apiUrl =
          API_ENDPOINTS.GET.DEGREES +
          (id === "LEVEL" ? "/level" : id === "YEAR" ? "/year" : "/field");

        const queryKey = [USER_ACTIVITIES.fetchDiplomas, apiUrl];

        // 2) Merge la nouvelle donnée dans le cache (shape dépend de ton API)
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return data;
          // suppose old = { ok: true, data: [ ... ] }
          const oldData = Array.isArray(old.data) ? old.data : [];
          return {
            ...old,
            data: [...oldData, data.data], // append le nouvel item
          };
        });
      },
      onError(error) {
        setLastUserActivity(USER_ACTIVITIES.degreeCreation);
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
