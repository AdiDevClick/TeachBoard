import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type TasksErrorStatus = 400 | 401 | 404 | 500;

/**
 * OpenAPI: `Task`
 * Task returned by GET `/tasks`.
 */
export interface TaskDto {
  id: UUID;
  name: string;
  description?: string;
  colorCode?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Data payload returned by the "TASKS" fetch.
 */
export type TasksFetch = TaskDto[];

/**
 * Data payload returned by POST `/tasks`.
 */
export type CreateTaskResponseData = TaskDto;

export type TasksSuccess =
  | Extract<ApiSuccess<TasksFetch>, { status: 200 }>
  | Extract<ApiSuccess<CreateTaskResponseData>, { status: 201 }>;

export type TasksError = Extract<ApiError, { status: TasksErrorStatus }>;

export type TasksRouteResult = AppRouteResponseContract<
  TasksSuccess,
  TasksError
>;
