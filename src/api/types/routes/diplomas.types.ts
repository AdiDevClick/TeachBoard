import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";

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
  skills?: SkillsViewDto[];
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
