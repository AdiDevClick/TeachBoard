import type TaskItem from "@/components/ClassCreation/task/task-item/TaskItem.tsx";
import type { useForm } from "react-hook-form";

/**
 * Props for the TaskItemController component.
 */
export type TaskItemControllerProps = {
  formId?: string;
  form: ReturnType<typeof useForm>;
  className?: string;
} & Omit<Parameters<typeof TaskItem>[0], "modalMode">;
