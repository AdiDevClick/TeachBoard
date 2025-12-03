import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
      onSuccess(response) {
        setLastUserActivity(USER_ACTIVITIES.degreeCreation);
        if (!response.data.degree) throw new Error("No data returned from API");
        toast.success("Nouveau diplôme créé avec succès.");

        // Merge the new data into the existing cache
        const queryKey = queryParams.cachedFetchKey;

        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return response.data.degree;

          if (!Array.isArray(old)) return response;

          // La structure de la réponse est : response.data.degree = { id, name, code, description, type }
          const newItem = response.data.degree;
          const mappedNewItem = {
            id: newItem?.id,
            value: newItem?.name,
          };

          if (!mappedNewItem.id || !mappedNewItem.value) {
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
