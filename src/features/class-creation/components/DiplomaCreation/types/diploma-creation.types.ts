import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type DiplomaCreation from "@/features/class-creation/components/DiplomaCreation/DiplomaCreation.tsx";
import type { DiplomaCreationFormSchema } from "@/features/class-creation/components/DiplomaCreation/models/diploma-creation.models";
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
