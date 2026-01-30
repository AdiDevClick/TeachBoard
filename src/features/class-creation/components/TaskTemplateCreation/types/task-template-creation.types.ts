import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type { SkillsFormValues } from "@/api/types/routes/skills.types.ts";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { createTaskTemplateView } from "@/features/class-creation/components/TaskTemplateCreation/functions/task-template.functions.ts";
import type { TaskTemplateCreationFormSchema } from "@/features/class-creation/components/TaskTemplateCreation/models/class-task-template.models";
import type TaskTemplateCreation from "@/features/class-creation/components/TaskTemplateCreation/TaskTemplateCreation.tsx";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

// Extend the form schema with transient fields used by the controller
export type TaskTemplateCreationExtendedForm =
  TaskTemplateCreationFormSchema & {
    skillsDuplicate?: Array<[UUID, SkillsFormValues]>;
  };

/**
 * Props for the TaskTemplateCreationController component.
 */

export type TaskTemplateCreationControllerProps = AppControllerInterface<
  TaskTemplateCreationExtendedForm,
  typeof API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
  typeof API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape
> &
  Omit<Parameters<typeof TaskTemplateCreation>[0], "modalMode">;
/**
 * Parameters for fetching skills data for task templates.
 */
export type FetchSkillsDataParams = {
  diploma: Pick<DiplomaConfigDto, "modules">;
  savedSkills: { current?: ReturnType<typeof createTaskTemplateView> };
};
