import type { UUID } from "@/api/types/openapi/common.types.ts";

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
  subskills?: SubSkillsType[];
  mainSkills?: MainSkillsType[];
}

type MainSkillsType = {
  mainSkillId: UUID;
  mainSkillCode: string;
  mainSkillName: string;
};

type SubSkillsType = {
  id: UUID;
  code: string;
  name: string;
};

/**
 * View structure for skills including sub-skills.
 */
export type SkillsViewDto = MainSkillsType & { subSkills: SubSkillsType[] };

/**
 * Data payload returned by the "SKILLS" fetch.
 * The current reshaper reads `data.Skills`.
 */
export interface SkillsFetch {
  Skills: SkillDto[];
}

/**
 * Data payload returned by POST `/skills/(main|sub)`.
 *
 * The code supports both `{ skill: SkillDto }` and a raw `SkillDto`.
 */
export type CreateSkillResponseData = { skill: SkillDto } | SkillDto;
