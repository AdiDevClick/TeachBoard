import type { UUID, YearRange } from "@/api/types/openapi/common.types.ts";
import type { StudentDto } from "@/api/types/routes/students.types.ts";
import type { TaskTemplateDto } from "@/api/types/routes/task-templates.types.ts";
import type { TeacherDto } from "@/api/types/routes/teachers.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type ClassesFetchErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;
export type CreateClassErrorStatus = 400 | 401 | 403 | 500;
export type ClassNameAvailabilityErrorStatus = 400 | 401 | 403 | 409 | 500;
export type ClassCreatedStatus = 201;
export type ClassFetchStatus = 200;

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
 * Data payload returned by GET `/classes/check-name/:name`.
 */
export type ClasseNameAvailabilityResponse = {
  available: boolean;
};

/**
 * Data payload returned by POST `/classes`.
 */
export type CreateClassResponseData = ClassDto & { degreeLevel: string };

/**
 * Extract success for the "CLASSES" routes.
 */
export type ClassSuccess = Extract<
  ApiSuccess<
    CreateClassResponseData | ClassesFetch | ClasseNameAvailabilityResponse
  >,
  { status: ClassCreatedStatus | ClassFetchStatus }
>;

/**
 * Extract error for the "CLASSES" routes.
 */
export type ClassError = Extract<
  ApiError,
  {
    status:
      | ClassesFetchErrorStatus
      | CreateClassErrorStatus
      | ClassNameAvailabilityErrorStatus;
  }
>;

/**
 * Final route response type for the "CLASSES" routes.
 */
export type ClassRouteResponse = AppRouteResponseContract<
  ClassSuccess,
  ClassError
>;
