import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { TaskItemFormSchema } from "@/features/class-creation/components/TaskItem/models/task-item.models";
import type TaskItem from "@/features/class-creation/components/TaskItem/TaskItem.tsx";

/**
 * Props for the TaskItemController component.
 */
import type { AppControllerInterface } from "@/types/AppControllerInterface";

export type TaskItemControllerProps = AppControllerInterface<
  TaskItemFormSchema,
  typeof API_ENDPOINTS.POST.CREATE_TASK.endpoint,
  typeof API_ENDPOINTS.POST.CREATE_TASK.dataReshape
> &
  Omit<Parameters<typeof TaskItem>[0], "modalMode">;
