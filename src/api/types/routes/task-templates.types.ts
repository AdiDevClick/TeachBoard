import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { DiplomaConfigDto } from "@/api/types/routes/diplomas.types.ts";
import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";
import type { TaskDto } from "@/api/types/routes/tasks.types";

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
