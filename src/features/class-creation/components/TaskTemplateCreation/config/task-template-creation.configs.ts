/**
 * @fileoverview This file contains the TaskTemplateCreation component and its related configurations for the class creation feature.
 */

import {
  TASK_TEMPLATE_CREATION_INPUTS_CONTROLLERS,
  TASK_TEMPLATE_CREATION_DYNAMIC_TAGS_CONTROLLERS,
  TASK_TEMPLATE_CREATION_POPOVER_CONTROLLERS,
} from "@/features/class-creation/components/TaskTemplateCreation/forms/task-template-inputs";
import type { TaskTemplateCreationControllers } from "@/features/class-creation/components/TaskTemplateCreation/types/task-template-creation.types";

export const TASK_TEMPLATE_TITLE = {
  title: "Création de nouvelles tâches",
  description: "Ces tâches pourront être associées aux modules de compétences.",
};

export const TASK_TEMPLATE_FOOTER = {
  submitText: "Ajouter",
  cancelText: "Annuler",
};

/**
 * Controllers for the TaskTemplateCreation component.
 */
export const TASK_TEMPLATE_CREATION_CONTROLLERS: TaskTemplateCreationControllers =
  {
    inputs: TASK_TEMPLATE_CREATION_INPUTS_CONTROLLERS,
    dynamicTags: TASK_TEMPLATE_CREATION_DYNAMIC_TAGS_CONTROLLERS,
    popovers: TASK_TEMPLATE_CREATION_POPOVER_CONTROLLERS,
  };
