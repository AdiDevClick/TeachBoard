import type TaskItem from "@/components/ClassCreation/task/task-item/TaskItem.tsx";
import type { TaskItemFormSchema } from "@/models/task-item.models.ts";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for the TaskItemController component.
 */
export type TaskItemControllerProps = Readonly<
  {
    formId?: string;
    form: UseFormReturn<TaskItemFormSchema>;
    className?: string;
    pageId: string;
  } & Omit<Parameters<typeof TaskItem>[0], "modalMode">
>;
