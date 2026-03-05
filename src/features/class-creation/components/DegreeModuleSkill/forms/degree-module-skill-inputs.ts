import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { DegreeModuleSkillController } from "@/features/class-creation/components/DegreeModuleSkill/controllers/DegreeModuleSkillController.tsx";

export const degreeSubSkillsCreationInputControllers = [
  {
    name: "name",
    title: "Nom de la compétence",
    type: "text",
    placeholder: "Ex: Installer un switch manageable...",
    autoComplete: "off",
    apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.AVAILABILITY,
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: S1, A23...",
    autoComplete: "off",
    apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.AVAILABILITY,
  },
] satisfies Parameters<
  typeof DegreeModuleSkillController
>[0]["inputControllers"];
