import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type DegreeModule from "@/features/class-creation/components/DegreeModule/DegreeModule.tsx";

export const degreeModuleCreationInputControllers = [
  {
    name: "name",
    title: "Nom du module",
    type: "text",
    placeholder: "Ex: Mettre en place une infrastructure réseau...",
  },
  {
    name: "code",
    title: "Code",
    type: "text",
    placeholder: "Ex: C7, G90...",
  },
  {
    // id: "fetch-input-skills",
    apiEndpoint: API_ENDPOINTS.GET.SKILLS.endPoints.SUBSKILLS,
    dataReshapeFn: API_ENDPOINTS.GET.SKILLS.dataReshape,
    task: "new-degree-module-skill",
    name: "skillList",
    title: "Compétences",
    type: "text",
    useButtonAddNew: true,
    creationButtonText: "Ajouter une compétence",
    useCommands: true,
    placeholder: "Recherchez une compétence...",
  },
] satisfies Parameters<typeof DegreeModule>[0]["inputControllers"];
