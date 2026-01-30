import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type DegreeModule from "@/features/class-creation/components/DegreeModule/DegreeModule.tsx";
import type { DegreeModuleFormSchema } from "@/features/class-creation/components/DegreeModule/models/degree-module.models";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

/**
 * Props for DegreeModuleController component
 */

export type DegreeModuleControllerProps = AppControllerInterface<
  DegreeModuleFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE,
  typeof API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
> &
  Omit<Parameters<typeof DegreeModule>[0], "modalMode">;
