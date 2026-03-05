import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { TaskTemplateCreationControllers } from "@/features/class-creation/components/TaskTemplateCreation/types/task-template-creation.types";

export const TASK_TEMPLATE_CREATION_INPUTS_CONTROLLERS = [
  {
    name: "name",
    title: "Nom de la configuration",
    type: "text",
    placeholder: "Ex: BTS Cuisine - Serveur...",
    autoComplete: "off",
    task: "availability",
    apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.AVAILABILITY,
  },
  {
    name: "description",
    title: "Description",
    type: "text",
    placeholder: "Ex: La tâche consiste à ...",
    task: "availability",
  },
] satisfies TaskTemplateCreationControllers["inputs"];

export const TASK_TEMPLATE_CREATION_DYNAMIC_TAGS_CONTROLLERS = {
  id: "fetch-input-tasks",
  name: "degreeConfigId",
  title: "Diplôme associé",
  type: "text",
  placeholder: "Sélectionnez le diplôme associé...",
} satisfies TaskTemplateCreationControllers["dynamicTags"];

export const TASK_TEMPLATE_CREATION_POPOVER_CONTROLLERS = [
  {
    id: "fetch-input-tasks",
    apiEndpoint: API_ENDPOINTS.GET.TASKS.endpoints.ALL,
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
] satisfies TaskTemplateCreationControllers["popovers"];
