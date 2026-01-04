import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type { createTaskTemplateView } from "@/components/ClassCreation/task/task-template/functions/task-template.functions.ts";
import type TaskTemplateCreation from "@/components/ClassCreation/task/task-template/TaskTemplateCreation.tsx";
import type { TaskTemplateCreationFormSchema } from "@/models/class-task-template.models.ts";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for the TaskTemplateCreationController component.
 */
export type TaskTemplateCreationControllerProps = {
  formId: string;
  className?: string;
  form: UseFormReturn<TaskTemplateCreationFormSchema>;
} & Omit<Parameters<typeof TaskTemplateCreation>[0], "modalMode">;

/**
 * Parameters for fetching skills data for task templates.
 */
export type FetchSkillsDataParams = {
  diploma: Pick<DiplomaConfigDto, "skills">;
  savedSkills: { current?: ReturnType<typeof createTaskTemplateView> };
};
