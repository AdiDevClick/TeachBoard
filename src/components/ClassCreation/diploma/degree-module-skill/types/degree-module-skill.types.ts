import type DegreeModuleSkill from "@/components/ClassCreation/diploma/degree-module-skill/DegreeModuleSkill.tsx";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { DegreeModuleSkillFormSchema } from "@/models/degree-module-skill.model.ts";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

export type DegreeModuleSkillControllerProps = AppControllerInterface<
  DegreeModuleSkillFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
  typeof API_ENDPOINTS.POST.CREATE_SKILL.dataReshape
> &
  Omit<Parameters<typeof DegreeModuleSkill>[0], "modalMode">;
