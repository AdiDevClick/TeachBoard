import type TaskTemplateCreation from "@/components/ClassCreation/task/task-template/TaskTemplateCreation.tsx";
import type { TaskTemplateCreationFormSchema } from "@/models/class-task-template.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

/**
 * Props for the TaskTemplateCreationController component.
 */
export type TaskTemplateCreationControllerProps<
  T extends FieldValues = TaskTemplateCreationFormSchema
> = {
  formId?: string;
  className?: string;
  form: ReturnType<typeof useForm<T>>;
  diplomaDatas: unknown;
} & Omit<Parameters<typeof TaskTemplateCreation>[0], "modalMode">;
