/**
 * Generic degree referential item (level/year/field).
 *
 * Used by GET `/degrees/level`, `/degrees/year`, `/degrees/field`.
 */

import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type DegreesErrorStatus = 400 | 401 | 404 | 500;

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

// GET returns array, POST returns created object – union both cases
export type DegreesSuccess =
  | Extract<ApiSuccess<DegreesFetch>, { status: 200 }>
  | Extract<ApiSuccess<CreateDegreeResponseData>, { status: 201 }>;

export type DegreesError = Extract<ApiError, { status: DegreesErrorStatus }>;

export type DegreesRouteResult = AppRouteResponseContract<
  DegreesSuccess,
  DegreesError
>;
