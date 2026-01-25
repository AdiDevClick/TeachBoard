/**
 * Module functions for evaluation store.
 *
 * These functions handle the management of sub-skills within modules,
 */

import type {
  ClassModules,
  EvaluationType,
  StudentEvaluationModuleType,
  StudentEvaluationSubSkillType,
  StudentWithPresence,
} from "@/api/store/types/steps-creation-store.types.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { SkillsType } from "@/api/types/routes/skills.types.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";

/**
 * Build linked sub-skills with associated task IDs.
 *
 * @description This facilitates tracking which sub-skills are linked to specific tasks for evaluation purposes.
 *
 * @param subSkills - The sub-skills to process
 * @param taskId - The task ID to link with the sub-skills
 */
export function buildLinkedSubSkills(
  subSkills: SkillsType[] | undefined,
  taskId: UUID,
) {
  return (subSkills ?? [])
    .filter((s) => s.id)
    .map((subSkill) => {
      return {
        ...subSkill,
        isLinkedToTasks: new Set([taskId]),
      };
    });
}

/**
 * Upsert sub-skills into a module with associated task IDs.
 * @description This ensures that sub-skills are not duplicated and are enriched with all associated task IDs.
 *
 * @param module - The module to update
 * @param subSkills - The sub-skills to upsert
 * @param taskId - The task ID to link with the sub-skills
 */
export function upsertModuleSubSkills(
  module: ClassModules,
  subSkills: SkillsType[] | undefined,
  taskId: UUID,
) {
  for (const subSkill of subSkills ?? []) {
    if (!subSkill.id) continue;

    const existingSubSkill = module.subSkills.get(subSkill.id);

    if (!existingSubSkill) {
      module.subSkills.set(subSkill.id, {
        ...subSkill,
        isLinkedToTasks: new Set([taskId]),
      });
      continue;
    }

    const savedIsLinkedToTasks = existingSubSkill.isLinkedToTasks;

    if (savedIsLinkedToTasks) {
      savedIsLinkedToTasks.add(taskId);
    } else {
      // !! IMPORTANT !!
      // This should never trigger but just in case
      // This avoids a bug where isLinkedToTasks is undefined.
      const newSubSkill = {
        ...existingSubSkill,
        isLinkedToTasks: new Set([taskId]),
      };

      module.subSkills.delete(subSkill.id).set(subSkill.id, newSubSkill);
    }
  }
}

/**
 * Update evaluation score for a student's module and sub-skill.
 *
 * @param existingModuleSet - The existing module evaluation for the student.
 * @param newSubSkillItem - The new sub-skill evaluation item to add or update.
 * @param modulesList - The list of modules to update.
 */
export function updateEvaluationScore(
  existingModuleSet: StudentEvaluationModuleType,
  newSubSkillItem: StudentEvaluationSubSkillType,
  modulesList: UniqueSet<UUID, StudentEvaluationModuleType>,
) {
  existingModuleSet.subSkills.set(newSubSkillItem.id, newSubSkillItem);
  modulesList.set(existingModuleSet.id, existingModuleSet);
}

/**
 * Add a new evaluation score for a student.
 *
 * @param existingStudentEvaluation - The existing evaluations of the student.
 * @param module - The module for which the evaluation is being added.
 * @param newSubSkillItem - The new sub-skill evaluation item to add.
 * @param modulesList - The list of modules to update.
 */
export function addNewEvaluationScore(
  existingStudentEvaluation: StudentWithPresence["evaluations"],
  module: EvaluationType["module"],
  newSubSkillItem: StudentEvaluationSubSkillType,
  modulesList: UniqueSet<UUID, StudentEvaluationModuleType>,
) {
  if (!module || !existingStudentEvaluation) return;

  const newSubSkillSet = new UniqueSet<UUID, StudentEvaluationSubSkillType>();

  const newModule = {
    id: module.id,
    name: module.name,
    code: module.code,
    subSkills: newSubSkillSet,
  };

  updateEvaluationScore(newModule, newSubSkillItem, modulesList);
}
