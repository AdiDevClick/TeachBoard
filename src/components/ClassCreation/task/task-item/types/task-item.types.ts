import type TaskItem from "@/components/ClassCreation/task/task-item/TaskItem.tsx";
import type { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { TaskItemFormSchema } from "@/models/task-item.models.ts";

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
