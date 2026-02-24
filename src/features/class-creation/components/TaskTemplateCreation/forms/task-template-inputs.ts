import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type TaskTemplateCreation from "@/features/class-creation/components/TaskTemplateCreation/TaskTemplateCreation";

export const taskTemplateCreationInputControllers = [
  {
    name: "name",
    title: "Nom de la configuration",
    type: "text",
    placeholder: "Ex: BTS Cuisine - Serveur...",
  },
  {
    name: "description",
    title: "Description",
    type: "text",
    placeholder: "Ex: La tâche consiste à ...",
  },
  {
    id: "fetch-input-tasks",
    name: "degreeConfigId",
    title: "Diplôme associé",
    type: "text",
    placeholder: "Sélectionnez le diplôme associé...",
  },
  {
    id: "fetch-input-tasks",
    apiEndpoint: API_ENDPOINTS.GET.TASKS.endpoint,
    dataReshapeFn: API_ENDPOINTS.GET.TASKS.dataReshape,
    name: "taskId",
    task: "new-task-item",
    label: "Tâche",
    type: "text",
    placeholder: "Sélectionnez un nom...",
    useButtonAddNew: true,
    creationButtonText: "Ajouter une tâche",
    useCommands: true,
  },
  {
    id: "fetch-input-modules-for-tasks",
    multiSelection: true,
    task: "new-task-module",
    name: "modules",
    label: "Compétences associées",
    type: "text",
    useCommands: true,
    placeholder: "Recherchez une compétence...",
  },
] satisfies Parameters<typeof TaskTemplateCreation>[0]["inputControllers"];
