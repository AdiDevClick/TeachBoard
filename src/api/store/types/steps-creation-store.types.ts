import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { TemplateSkillsViewDto } from "@/api/types/routes/skills.types.ts";
import type { UniqueSet } from "@/utils/UniqueSet.ts";

/**
 * Student with presence information for Steps Creation.
 */
export type StudentWithPresence = {
  id: UUID;
  fullName: string;
  isPresent: boolean;
  assignedTask?: Pick<ClassTasks, "id" | "name"> | null;
};

/**
 * Class tasks structure for Steps Creation.
 */
export type ClassTasks = {
  id: UUID;
  name: string | null;
  skills: TemplateSkillsViewDto[];
};

/**
 * State interface for Steps Creation Store.
 */
export interface StepsCreationState {
  /** Full class summary */
  selectedClass?: ClassSummaryDto | null;
  diplomaName?: string | null;
  className?: string | null;
  id?: UUID | null;
  description?: string | null;
  students?: UniqueSet<UUID, StudentWithPresence>;
  tasks?: UniqueSet<UUID, ClassTasks>;
  evaluations?: unknown[] | null;
}
