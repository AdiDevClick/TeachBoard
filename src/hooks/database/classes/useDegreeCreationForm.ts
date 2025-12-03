import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useDegreeCreationForm(endpoint: "LEVEL" | "YEAR" | "FIELD") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const clearUser = useAppStore((state) => state.clearUser);
  const setLastUserActivity = useAppStore((state) => state.setLastUserActivity);

  const [queryParams, setQueryParams] = useState<{
    cachedFetchKey: string[];
    endPoint: "LEVEL" | "YEAR" | "FIELD";
  }>({
    cachedFetchKey: [],
    endPoint: endpoint,
  });

  const fetchKey = USER_ACTIVITIES.degreeCreation;
  const url = API_ENDPOINTS.POST.CREATE_DEGREE[queryParams.endPoint];

  const queryOnSubmit = useQueryOnSubmit([
    fetchKey,
    {
      url: url,
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
        //  const queryKey = cachedFetchKeyRef.current;
        //         console.log("my keys => ", queryKey);

        //         if (queryKey.length === 0) {
        //           console.warn("No cache key set, skipping cache update");
        //           return;
        //         }
        // cachedFetchKey est déjà un tableau, ne pas l'envelopper à nouveau
        const queryKey = queryParams.cachedFetchKey;

        // 2) Merge the new data into the existing cache
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return data.data.degree;
          // Suppose old is an array of groups [{ groupTitle, items: [] }]
          if (!Array.isArray(old)) return data;

          // La structure de la réponse est : data.data.degree = { id, name, code, description, type }
          const newItem = data.data.degree;
          const mappedNewItem = {
            id: newItem?.id,
            value: newItem?.name,
          };

          // Vérifier que le mapping a fonctionné
          if (
            mappedNewItem.id === undefined ||
            mappedNewItem.value === undefined
          ) {
            console.error("Failed to map new item, data structure:", newItem);
            return old;
          }

          // Append the item to the first group if present
          const newGroups = [
            { ...old[0], items: [...old[0].items, mappedNewItem] },
          ];

          return newGroups;
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
  return { ...queryOnSubmit, setQueryParams };
}
