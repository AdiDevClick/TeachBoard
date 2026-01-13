import type { UUID, YearRange } from "@/api/types/openapi/common.types.ts";
import type { StudentDto } from "@/api/types/routes/students.types.ts";
import type { TaskTemplateDto } from "@/api/types/routes/task-templates.types.ts";
import type { TeacherDto } from "@/api/types/routes/teachers.types.ts";

/** OpenAPI: `ClassSummaryDTO` */
export interface ClassSummaryDto {
  id: UUID;
  name: string;
  description?: string;
  schoolYear?: YearRange;
  degreeConfigName?: string;
  degreeLevel: string;
  degreeYearCode: string;
  degreeYearName: string;
  evaluations: [];
  primaryTeacher?: TeacherDto;
  students: StudentDto[];
  templates: TaskTemplateDto[];
}

/**
 * A class item (minimal shape used by the frontend).
 */
export type ClassDto = ClassSummaryDto;

/**
 * Data payload returned by GET `/classes/`.
 *
 * The current reshaper uses `transformTuplesToGroups`, but some backends also
 * return `{ classes: ClassDto[] }` or a plain array.
 */
export type ClassesFetch =
  | Record<string, ClassDto[]>
  | { classes: ClassDto[] }
  | ClassDto[];

/**
 * Data payload returned by POST `/classes`.
 */
export type CreateClassResponseData = ClassDto & { degreeLevel: string };
