import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ApiError } from "@/types/AppErrorInterface";
import type {
  ApiSuccess,
  AppRouteResponseContract,
} from "@/types/AppResponseInterface";

export type SkillsErrorStatus = 400 | 401 | 500;

export type SkillType = "MAIN" | "SUB";

/**
 * A skill item.
 *
 * Used by GET `/skills/main` and `/skills/sub`.
 */
/**
 * OpenAPI: `Skills` (plural in the spec)
 */
export interface SkillDto {
  id: UUID;
  name?: string;
  code: string;
  type?: SkillType;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  criteria?: SkillCriterionDto[];
  subskills?: SkillsType[];
  modules?: SkillsType[];
}

export type SkillCriterionDto = {
  id: UUID;
  score: number;
  criterion: string;
};

export type SkillsType = {
  id: UUID;
  code: string;
  name: string;
  criteria?: SkillCriterionDto[];
};

export type SkillsFormValues = {
  moduleId: UUID;
  subSkillId?: UUID[];
};

/**
 * View structure for skills including sub-skills.
 */
export type SkillsViewDto = SkillsType & { subSkills: SkillsType[] };

/**
 * Data payload returned by the "SKILLS" fetch.
 * The current reshaper reads `data.Skills`.
 */
export interface SkillsFetch {
  modules: SkillDto[];
}

/**
 * Data payload returned by POST `/skills/(main|sub)`.
 *
 * The code supports both `{ skill: SkillDto }` and a raw `SkillDto`.
 */
export type CreateSkillResponseData = { skill: SkillDto } | SkillDto;

export type SkillsSuccess =
  | Extract<ApiSuccess<SkillsFetch>, { status: 200 }>
  | Extract<ApiSuccess<CreateSkillResponseData>, { status: 201 }>;

export type SkillsError = Extract<ApiError, { status: SkillsErrorStatus }>;

export type SkillsRouteResult = AppRouteResponseContract<
  SkillsSuccess,
  SkillsError
>;
