import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type { SkillsFormValues } from "@/api/types/routes/skills.types.ts";
import type { createTaskTemplateView } from "@/components/ClassCreation/task/task-template/functions/task-template.functions.ts";
import type TaskTemplateCreation from "@/components/ClassCreation/task/task-template/TaskTemplateCreation.tsx";
import type { TaskTemplateCreationFormSchema } from "@/models/class-task-template.models.ts";
import type { UseFormReturn } from "react-hook-form";

// Extend the form schema with transient fields used by the controller
export type TaskTemplateCreationExtendedForm =
  TaskTemplateCreationFormSchema & {
    skillsDuplicate?: Array<[UUID, SkillsFormValues]>;
  };

/**
 * Props for the TaskTemplateCreationController component.
 */
export type TaskTemplateCreationControllerProps = {
  formId: string;
  className?: string;
  form: UseFormReturn<TaskTemplateCreationExtendedForm>;
} & Omit<Parameters<typeof TaskTemplateCreation>[0], "modalMode">;

/**
 * Parameters for fetching skills data for task templates.
 */
export type FetchSkillsDataParams = {
  diploma: Pick<DiplomaConfigDto, "skills">;
  savedSkills: { current?: ReturnType<typeof createTaskTemplateView> };
};
