import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type { SkillsFormValues } from "@/api/types/routes/skills.types.ts";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { createTaskTemplateView } from "@/features/class-creation/components/TaskTemplateCreation/functions/task-template.functions.ts";
import type {
  TaskTemplateCreationFormSchema,
  TaskTemplateCreationInputItem,
} from "@/features/class-creation/components/TaskTemplateCreation/models/class-task-template.models";
import type TaskTemplateCreation from "@/features/class-creation/components/TaskTemplateCreation/TaskTemplateCreation.tsx";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface";

// Extend the form schema with transient fields used by the controller
export type TaskTemplateCreationExtendedForm =
  TaskTemplateCreationFormSchema & {
    skillsDuplicate?: Array<[UUID, SkillsFormValues]>;
  };

export type TaskTemplateCreationDialogOptions = {
  selectedDiploma?: (CommandItemType & DiplomaConfigDto) | null;
  shortTemplatesList?: string[];
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

/**
 * Structured input controllers for the task template creation form.
 * Each key corresponds to a distinct sub-section of the form.
 */
export type TaskTemplateCreationControllers = {
  readonly dynamicTags: TaskTemplateCreationInputItem;
  readonly popovers: readonly TaskTemplateCreationInputItem[];
  readonly inputs: readonly TaskTemplateCreationInputItem[];
};

/**
 * Props for the TaskTemplateCreation component.
 */
export type TaskTemplateCreationProps = Readonly<
  Omit<
    PageWithControllers<TaskTemplateCreationControllers>,
    "inputControllers"
  > & {
    inputControllers?: TaskTemplateCreationControllers;
  }
>;
