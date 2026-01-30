import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type DegreeModuleSkill from "@/features/class-creation/components/DegreeModuleSkill/DegreeModuleSkill.tsx";
import type { DegreeModuleSkillFormSchema } from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

export type DegreeModuleSkillControllerProps = AppControllerInterface<
  DegreeModuleSkillFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
  typeof API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
> &
  Omit<Parameters<typeof DegreeModuleSkill>[0], "modalMode">;
