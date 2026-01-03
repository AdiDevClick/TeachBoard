import type { UUID } from "@/api/types/openapi/common.types.ts";

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
