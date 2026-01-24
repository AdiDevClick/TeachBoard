import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type {
  SkillsType,
  SkillsViewDto,
} from "@/api/types/routes/skills.types.ts";
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
  modules: SkillsViewDto[];
};

export type ClassModules = SkillsType & {
  subSkills: UniqueSet<UUID, SkillsType>;
  tasksList: Set<ClassTasks["id"]>;
  studentsToEvaluate?: Set<UUID>;
};

export type ModulesSelectionType = {
  isClicked: boolean;
  selectedModuleIndex: number | null;
  selectedModule: Omit<ClassModules, "subSkills"> | null;
  selectedModuleSubSkills: SkillsType[];
};

export type SubskillSelectionType = {
  isClicked: boolean;
  selectedSubSkillIndex: number | null;
  selectedSubSkill: SkillsType | null;
};

export type SetModulesSelectionType = Omit<
  ModulesSelectionType,
  "selectedModuleSubSkills"
> & { selectedModule: ClassModules };

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
  students: UniqueSet<UUID, StudentWithPresence>;
  tasks: UniqueSet<UUID, ClassTasks>;
  evaluations?: unknown[] | null;
  modules: UniqueSet<UUID, ClassModules>;
  moduleSelection: ModulesSelectionType;
  subSkillSelection: SubskillSelectionType;
}

export type SelectedClassModulesReturn = ClassModules[];
