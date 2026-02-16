/**
 * Module functions for evaluation store.
 *
 * These functions handle the management of sub-skills within modules,
 */

import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { SkillsType } from "@/api/types/routes/skills.types.ts";
import type {
  ByIdValue,
  ByNameValue,
  ClassModules,
  ClassModuleSubSkill,
  EvaluationType,
  NonPresentStudentsType,
  StepsCreationState,
  StudentEvaluationModuleType,
  StudentEvaluationSubSkillType,
  StudentWithPresence,
} from "@/features/evaluations/create/store/types/steps-creation-store.types.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import type { WritableDraft } from "immer";

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

/**
 * Update modules in the steps creation state.
 *
 * @description Destinated to be used in the flow of the setState function of the store.
 *
 * @param state - The current steps creation state
 * @param module - The module to update
 * @param items - The partial items to update in the module
 */
export function updateModules(
  state: WritableDraft<StepsCreationState>,
  module: ClassModules,
  items: Partial<ClassModules>,
) {
  const updatedModules = state.modules.clone();

  updatedModules.delete(module.id).set(module.id, { ...module, ...items });

  state.modules = updatedModules;
}

/**
 * Prepare a new set of sub-skills for a module update.
 *
 * @important !! IMPORTANT !! This method can optionally re-order the sub-skills with the updated one being last.
 *
 * @param updatedSubSkill - Newly created subskill
 * @param module - Module containing the previous subskill
 * @param subSkills - Existing sub-skills set to update. If null, the module's sub-skills will be used.
 * @param shouldReorder - Whether to reorder the sub-skills to place the updated one at the end.
 *
 * @returns The updated set of sub-skills ready for module update.
 */
export function preparedSubSkillsForUpdate(
  updatedSubSkill: ClassModuleSubSkill,
  module: ClassModules,
  subSkills: UniqueSet<UUID, ClassModuleSubSkill> | null = null,
  shouldReorder = false,
) {
  const updatedSubSkills = subSkills ?? module.subSkills.clone(true);

  if (shouldReorder) {
    updatedSubSkills
      .delete(updatedSubSkill.id)
      .set(updatedSubSkill.id, updatedSubSkill);
  } else {
    updatedSubSkills.set(updatedSubSkill.id, updatedSubSkill);
  }

  return updatedSubSkills;
}

/**
 * Filter sub-skills based on students availability.
 *
 * @description - This function checks if there are no students available for a given sub-skill and categorizes it into disabled or enabled arrays accordingly.
 *
 * {@link disableSubSkillsWithoutStudents} in {@link useEvaluationStepsCreationStore} uses this function.
 *
 * @param noStudentsAvailable - Whether there are no students available for the sub-skill
 * @param subSkill - The sub-skill to process
 * @param disabled - Array to collect disabled sub-skills
 * @param enabled - Array to collect enabled sub-skills
 */
export function filterSubSkillsBasedOnStudentsAvailability(
  noStudentsAvailable: boolean,
  subSkill: ClassModuleSubSkill,
  disabled: ClassModuleSubSkill[],
  enabled: ClassModuleSubSkill[],
) {
  const newObject = {
    ...subSkill,
    isDisabled: noStudentsAvailable,
  };

  if (noStudentsAvailable) {
    disabled.push(newObject);
  } else {
    enabled.push(newObject);
  }
}

/**
 * Verify if a student has an evaluation for a specific sub-skill within a module.
 *
 * @param student - The student to check
 * @param moduleId - The ID of the module
 * @param subSkillId - The ID of the sub-skill
 *
 * @returns True if the student has an evaluation for the specified sub-skill, false otherwise.
 */
export function isThisStudentAlreadyEvaluatedForThisSubSkill(
  student: StudentWithPresence,
  moduleId: UUID,
  subSkillId: UUID,
): boolean {
  const evaluations = student.evaluations;
  if (!evaluations) return false;

  const studentSelectedSubSkill = evaluations.modules
    .get(moduleId)
    ?.subSkills.get(subSkillId);

  return studentSelectedSubSkill?.score !== undefined;
}

/**
 * Check if a sub-skill is completed or disabled.
 *
 * @param subSkill - The sub-skill to check
 *
 * @returns True if the sub-skill is completed or disabled, false otherwise.
 */
export function isSubSkillCompletedOrDisabled(subSkill?: ClassModuleSubSkill) {
  if (!subSkill) return false;
  const { isCompleted, isDisabled } = subSkill;

  return Boolean(isCompleted) || Boolean(isDisabled);
}

/**
 * @remarks In case a module is used in multiple tasks, this ensures no duplication occurs and the module is enriched with all associated task ID's.
 *
 * Stores the modules from a class template into the store.
 *
 * @param task - The class template task containing modules
 * @param savedModules - The existing saved modules in the store
 */
export function setModules(
  task: ClassSummaryDto["templates"][number],
  savedModules?: WritableDraft<StepsCreationState>["modules"],
) {
  const { modules, id } = task;

  (modules ?? []).forEach((module) => {
    if (!module.id) return;
    const { subSkills, ...rest } = module;

    // Save or update module without subSkills first
    const savedModule = savedModules?.get(module.id);

    if (savedModule) {
      savedModule.tasksList.add(id);
      upsertModuleSubSkills(savedModule, subSkills, id);
    } else {
      const newProperties = {
        ...rest,
        subSkills: new UniqueSet<UUID, SkillsType>(
          null,
          buildLinkedSubSkills(subSkills, id),
        ),
        tasksList: new Set([id]),
      };

      savedModules?.set(module.id, newProperties);
    }
  });
}

/**
 * Calculate the average score for a student across all evaluated sub-skills.
 *
 * @param student - The student entry containing evaluations
 * @returns The average score of the student
 */
export const getStudentAverageScore = (
  student: StudentWithPresence,
): number => {
  const studentEvaluations = student.evaluations;

  if (!studentEvaluations) {
    return 0;
  }

  let totalScore = 0;
  let scoreCount = 0;

  for (const module of studentEvaluations.modules.values()) {
    for (const subSkill of module.subSkills.values()) {
      if (typeof subSkill.score === "number") {
        totalScore += subSkill.score;
        scoreCount += 1;
      }
    }
  }

  return scoreCount > 0 ? totalScore / scoreCount : 0;
};

/**
 * Save non-present students into the unique sets for both byId and byName.
 *
 * @param student - The student to save as non-present
 * @param uniqueSet  - The unique set containing byId and byName sets to update
 */
export function saveNonPresentStudents(
  student: StudentWithPresence,
  uniqueSet: NonPresentStudentsType | WritableDraft<NonPresentStudentsType>,
) {
  uniqueSet.byId.set(student.id, [student.fullName]);
  uniqueSet.byName.set(student.fullName, { id: student.id });
}

/**
 * Remove a student from the non-present students unique sets when they are marked as present.
 *
 * @param student - The student to remove from non-present lists
 * @param uniqueSet - The unique set containing byId and byName sets to update
 */
export function removeFromNonPresentStudents(
  student: StudentWithPresence,
  uniqueSet: NonPresentStudentsType | WritableDraft<NonPresentStudentsType>,
) {
  uniqueSet.byId.delete(student.id);
  uniqueSet.byName.delete(student.fullName);
}

/**
 * Compute a snapshot of non-present students based on the current students' presence status.
 *
 * @param students - The students to evaluate for presence and compute the non-present students snapshot
 *
 * @return The object ready to be stored in the state, containing the non-present students categorized by ID and name, along with the total count.
 */
export function computeNonPresentStudentsSnapshot(
  students: StepsCreationState["students"],
): NonPresentStudentsType {
  const results: NonPresentStudentsType = {
    byId: new UniqueSet<StudentWithPresence["id"], ByIdValue>(),
    byName: new UniqueSet<StudentWithPresence["fullName"], ByNameValue>(),
    count: 0,
  };

  students?.forEach((student) => {
    if (!student.isPresent) {
      saveNonPresentStudents(student, results);
    }
  });

  results.count = results.byId.size;

  return results;
}
