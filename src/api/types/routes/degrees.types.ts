/**
 * Generic degree referential item (level/year/field).
 *
 * Used by GET `/degrees/level`, `/degrees/year`, `/degrees/field`.
 */

import type { UUID } from "@/api/types/openapi/common.types.ts";

export type DegreeType = "FIELD" | "YEAR" | "LEVEL";
/**
 * OpenAPI: `DegreeViewDTO`
 * Used by GET `/degrees/level`, `/degrees/year`, `/degrees/field`.
 */
export interface DegreeRefDto {
  id: UUID;
  name: string;
  code: string;
  description?: string;
  type?: DegreeType;
  identifier?: string;
  entityTypeName?: string;
}

/**
 * Data payload returned by the "DEGREES" fetch endpoints.
 */
export type DegreesFetch = DegreeRefDto[];

/**
 * Data payload returned by POST `/degrees/(level|year|field)`.
 */
export interface CreateDegreeResponseData {
  degree: DegreeRefDto;
}
