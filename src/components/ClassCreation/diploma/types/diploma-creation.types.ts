import type DiplomaCreation from "@/components/ClassCreation/diploma/DiplomaCreation.tsx";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { DiplomaCreationFormSchema } from "@/models/diploma-creation.models.ts";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

/**
 * Props for DiplomaCreationController component
 */

export type DiplomaCreationControllerProps = AppControllerInterface<
  DiplomaCreationFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
  typeof API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape
> &
  Omit<Parameters<typeof DiplomaCreation>[0], "modalMode">;
