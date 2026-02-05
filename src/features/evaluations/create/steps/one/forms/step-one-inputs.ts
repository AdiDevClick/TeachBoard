import { rightContent } from "@/assets/css/EvaluationPage.module.scss";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { StepOne } from "@/features/evaluations/create/steps/one/StepOne.tsx";

export const stepOneInputControllers = [
  {
    name: "classe",
    label: "Classes disponibles",
    type: "text",
    placeholder: "Choisir...",
    apiEndpoint: API_ENDPOINTS.GET.CLASSES.endPoints.ALL,
    dataReshapeFn: API_ENDPOINTS.GET.CLASSES.dataReshape,
    task: "class-creation",
    useCommands: true,
    creationButtonText: "Créer une classe",
    useButtonAddNew: true,
    className: rightContent,
  },
] satisfies Parameters<typeof StepOne>[0]["inputControllers"];
