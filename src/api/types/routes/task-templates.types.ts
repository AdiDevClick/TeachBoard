import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";
import type { TaskDto } from "@/api/types/routes/tasks.types";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type TaskTemplatesErrorStatus = 400 | 401 | 404 | 500;

/** OpenAPI: `TaskViewDTO` (concise view) */
export type TaskViewDto = Pick<TaskDto, "id" | "name" | "description">;

/**
 * Task-template returned by GET `/task-templates`.
 */
export interface TaskTemplateDto {
  id: UUID;
  name?: string;
  task: TaskViewDto & { id: UUID };
  degreeConfiguration?: DiplomaConfigDto;
  modules?: SkillsViewDto[];
  taskName?: string;
}

/**
 * Data payload returned by the "TASKSTEMPLATES" fetch.
 */
export interface TaskTemplatesFetch {
  taskTemplates: TaskTemplateDto[];
  shortTemplatesList?: string[];
}

/**
 * Data payload returned by POST `/task-templates`.
 */
export interface CreateTaskTemplateResponseData {
  id: UUID;
  task: TaskViewDto;
}

export type TaskTemplatesSuccess =
  | Extract<ApiSuccess<TaskTemplatesFetch>, { status: 200 }>
  | Extract<ApiSuccess<CreateTaskTemplateResponseData>, { status: 201 }>;

export type TaskTemplatesError = Extract<
  ApiError,
  { status: TaskTemplatesErrorStatus }
>;

export type TaskTemplatesRouteResult = AppRouteResponseContract<
  TaskTemplatesSuccess,
  TaskTemplatesError
>;
