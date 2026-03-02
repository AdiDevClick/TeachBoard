import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type DiplomasErrorStatus = 400 | 401 | 404 | 500;

/**
 * Single diploma configuration returned by the backend.
 *
 * Used by GET `/degrees/config` (aka "DIPLOMAS" in `API_ENDPOINTS`).
 */
export interface DiplomaConfigDto {
  id: UUID;
  degreeLevel: string;
  degreeYear: string;
  degreeField: string;
  modules?: SkillsViewDto[];
}

/**
 * Data payload returned by the "DIPLOMAS" fetch.
 *
 * The code uses `transformTuplesToGroups`, which implies the backend returns
 * an object whose keys are group labels and values are arrays of configs.
 */
export type DiplomasFetch = Record<string, DiplomaConfigDto[]>;

/**
 * Data payload returned by POST `/degrees/config` (create a diploma config).
 */
export type CreateDiplomaResponseData = DiplomaConfigDto;

export type DiplomasSuccess =
  | Extract<ApiSuccess<DiplomasFetch>, { status: 200 }>
  | Extract<ApiSuccess<CreateDiplomaResponseData>, { status: 201 }>;

export type DiplomasError = Extract<ApiError, { status: DiplomasErrorStatus }>;

export type DiplomasRouteResult = AppRouteResponseContract<
  DiplomasSuccess,
  DiplomasError
>;
