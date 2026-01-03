import type { UUID } from "@/api/types/openapi/common.types.ts";

/** OpenAPI: `ClassSummaryDTO` */
export interface ClassSummaryDto {
  id: UUID;
  name: string;
  description?: string;
  schoolYear?: string;
  degreeConfigName?: string;
  degreeLevel?: string;
  degreeYearCode?: string;
  degreeYearName?: string;
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
