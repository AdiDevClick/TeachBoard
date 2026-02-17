import { createStepsCreationDebugRehydrators } from "@/api/store/functions/debug.functions.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";
import type { NonLabelledGroupItemProps } from "@/components/Selects/types/select.types";
import { DEV_MODE } from "@/configs/app.config.ts";
import {
  addNewEvaluationScore,
  filterSubSkillsBasedOnStudentsAvailability,
  getStudentAverageScore,
  isSubSkillCompletedOrDisabled,
  isThisStudentAlreadyEvaluatedForThisSubSkill,
  preparedSubSkillsForUpdate,
  removeFromNonPresentStudents,
  saveNonPresentStudents,
  setModules,
  updateEvaluationScore,
  updateModules,
} from "@/features/evaluations/create/store/functions/evaluation-store.functions.ts";
import type {
  ClassModuleSubSkill,
  EvaluationType,
  ModulesSelectionType,
  NonPresentStudentsResult,
  StepsCreationState,
  StudentWithPresence,
  SubskillSelectionType,
} from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { ObjectReshape } from "@/utils/ObjectReshape.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const createDefaultStepsCreationState = (): StepsCreationState => ({
  id: null,
  description: null,
  students: new UniqueSet(),
  tasks: new UniqueSet(),
  evaluations: null,
  diplomaName: null,
  className: null,
  selectedClass: null,
  modules: new UniqueSet(),
  moduleSelection: {
    isClicked: false,
    selectedModuleIndex: null,
    selectedModuleId: null,
  },
  subSkillSelection: {
    isClicked: false,
    selectedSubSkillIndex: null,
    selectedSubSkillId: null,
  },
  nonPresentStudentsResult: null,
});

export const DEFAULT_VALUES_STEPS_CREATION_STATE: StepsCreationState =
  createDefaultStepsCreationState();

/**
 * Persisting Steps Creation store.
 *
 * @remark Use "actions" to call another action within the same store (e.g., @see `setSelectedClass` implementation).
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 */
export const useEvaluationStepsCreationStore = create(
  devtools(
    immer(
      combine(DEFAULT_VALUES_STEPS_CREATION_STATE, (set, get) => {
        const { ensureCollectionsInDraft, ensureCollections } =
          createStepsCreationDebugRehydrators(get, set);

        const ACTIONS = {
          clear: (classId: UUID) => {
            if (get().selectedClass?.id === classId) {
              return false;
            }

            set(createDefaultStepsCreationState(), undefined, "clearStore");

            return true;
          },
          /**
           * INITIALIZE STORE ACTION
           *
           * Set the selected class and load its students and tasks into the store.
           *
           * @description This is triggered when an available class is selected for evaluation stepOne list.
           *
           * @param selectedClass - The class summary DTO to set as selected class
           * @returns
           */
          setSelectedClass(selectedClass: ClassSummaryDto) {
            let shouldClear = false;

            shouldClear = ACTIONS.clear(selectedClass.id);

            if (!shouldClear) return;

            set(
              (state) => {
                const { id, description, evaluations, name } = selectedClass;

                return {
                  ...state,
                  selectedClass,
                  id: id || null,
                  description: description || null,
                  evaluations: evaluations || null,
                  className: name || null,
                };
              },
              undefined,
              "setSelectedClass",
            );

            ACTIONS.setStudents(selectedClass.students);
            ACTIONS.setClassTasks(selectedClass.templates);
          },
          /**
           * Clear the selected class from the store.
           *
           * @param classId - Optional class ID to check before clearing
           */
          clearSelectedClass(classId?: UUID) {
            set(
              (state) => {
                if (state.selectedClass?.id === classId) {
                  return state;
                }
                state.selectedClass = null;
                state.description = null;
              },
              undefined,
              "clearSelectedClass",
            );
          },
          /**
           * Set the class tasks into the store.
           *
           * @description Loads the tasks and their associated modules into the store.
           *
           * @param tasks - The class tasks to set
           */
          setClassTasks(tasks: ClassSummaryDto["templates"]) {
            set(
              (state) => {
                ensureCollectionsInDraft(state);
                const savedModules = state.modules;

                tasks.forEach((task) => {
                  const details = {
                    id: task.id,
                    name: task.taskName ?? null,
                    modules: new UniqueSet<UUID, SkillsViewDto>(
                      null,
                      task.modules ?? [],
                    ),
                  };
                  state.tasks.set(task.id, details);
                  setModules(task, savedModules);
                });
              },
              undefined,
              "setClassTasks",
            );
          },
          setDiplomaName(name: string) {
            set(
              (state) => {
                state.diplomaName = name;
              },
              undefined,
              "setDiplomaName",
            );
          },
          /**
           * Set the students into the store.
           *
           * @description Loads the students with default presence and task assignment values.
           *
           * @param students - The class students to set
           */
          setStudents(students: ClassSummaryDto["students"]) {
            set(
              (state) => {
                ensureCollectionsInDraft(state);
                students.forEach((student) => {
                  const details = {
                    id: student.id,
                    fullName: student.firstName + " " + student.lastName,
                    isPresent: false,
                    assignedTask: null,
                  };
                  state.students.set(student.id, details);
                });
              },
              undefined,
              "setStudents",
            );
          },
          /**
           * Set the presence status for a student.
           *
           * @description Updates the presence status of the specified student and manages module evaluations(clear) accordingly.
           *
           * @param studentId - The ID of the student to update
           * @param isPresent - The presence status to set
           */
          setStudentPresence(studentId: UUID, isPresent: boolean) {
            ensureCollections();
            const student = get().students.get(studentId) ?? null;

            if (student) {
              student.isPresent = isPresent;

              if (student.assignedTask) {
                ACTIONS.setStudentToModuleEvaluation(
                  student.assignedTask.id,
                  studentId,
                );
              }

              // !! IMPORTANT !! A student marked as not present should not have any assigned task or be part of module evaluations
              if (!isPresent) {
                ACTIONS.clearStudentFromModuleEvaluation(studentId);
              }

              ACTIONS.updateNonPresentStudentPresence(student, isPresent);
            }
          },
          /**
           * Update the non-present students collection in the store based on a student's presence status.
           *
           * @param student - The student whose presence status has been updated
           * @param isPresent - The updated presence status of the student
           */
          updateNonPresentStudentPresence(
            student: StudentWithPresence,
            isPresent: boolean,
          ) {
            set(
              (state) => {
                ensureCollectionsInDraft(state);

                const nonPresentStudents =
                  state.nonPresentStudentsResult ??
                  (state.students.clone() as unknown as NonPresentStudentsResult);

                if (!nonPresentStudents) return;

                if (!isPresent) {
                  saveNonPresentStudents(student, nonPresentStudents);
                }

                if (isPresent) {
                  removeFromNonPresentStudents(student, nonPresentStudents);
                }

                state.nonPresentStudentsResult = nonPresentStudents;
              },
              undefined,
              "updateNonPresentStudentPresence/remove-add-FromNonPresent",
            );
          },
          /**
           * Set all non-present students in the store at once.
           *
           * @description This needs a set that can search by fullName and one by IDs to be able to update the presence status from both the list of students and the dynamic tags.
           *
           * @param object - The object containing both byId and byName unique sets for non-present students
           */
          setAllNonPresentStudents() {
            ensureCollections();
            const results = get().nonPresentStudentsResult as
              | StepsCreationState["students"]
              | null;
            // Rebuild cached `nonPresentStudentsResult` as a UniqueSet of tuples
            if (!results) return;
            const next = results.clone() as unknown as NonPresentStudentsResult;

            results.forEach((student) => {
              if (student.isPresent === false) {
                removeFromNonPresentStudents(student, next);
                saveNonPresentStudents(student, next);
              }
            });

            set(
              (state) => {
                ensureCollectionsInDraft(state);
                state.nonPresentStudentsResult = next;
              },
              undefined,
              "setAllNonPresentStudents",
            );
          },

          /**
           * Set the average score for a student.
           *
           * @param studentId - The ID of the student
           * @param overallScore - The overall score to set
           *
           * @note This score can be overwritten by the teacher and will be saved as is.
           */
          setStudentOverallScore(studentId: UUID, overallScore: number | null) {
            set(
              (state) => {
                ensureCollectionsInDraft(state);
                const student = state.students.get(studentId);

                if (student && student.overallScore !== overallScore) {
                  student.overallScore = overallScore;
                }
              },
              undefined,
              "setStudentOverallScore",
            );
          },
          /**
           * Assign a task to a student.
           *
           * @description Updates the student's assigned task and manages module evaluations accordingly.
           * @param studentId - The ID of the student to assign the task to
           * @param taskId - The ID of the task to assign
           */
          setStudentTaskAssignment(taskId: UUID, studentId: UUID) {
            if (!taskId || !studentId) {
              throw new TypeError("Both taskId and studentId are required.");
            }
            let previousTaskId: UUID | null | undefined = null;
            ensureCollections();
            const nextTask = get().tasks.get(taskId);

            set(
              (state) => {
                ensureCollectionsInDraft(state);

                const student = state.students.get(studentId);
                previousTaskId = student?.assignedTask?.id;

                if (!student || previousTaskId === taskId) {
                  return;
                }

                const studentEvaluations = student?.evaluations;

                // Clear all existing evaluations when changing tasks
                if (studentEvaluations && previousTaskId) {
                  student.evaluations = null;
                }

                if (nextTask) {
                  student.assignedTask = {
                    id: nextTask.id,
                    name: nextTask.name,
                  };
                }
              },
              undefined,
              "setStudentTaskAssignment",
            );

            ACTIONS.clearStudentFromModuleEvaluation(studentId);
            ACTIONS.setStudentToModuleEvaluation(taskId, studentId);
            ACTIONS.refreshCompletionForTasks([previousTaskId!, taskId]);
          },
          /**
           * Assign a student to module evaluations based on their assigned task.
           *
           * @remarks This is useful to ensure not to display any modules for students who are not present.
           *
           * @description Used when a student is marked present and assigned a task.
           *
           * @param taskId - The ID of the assigned task
           * @param studentId - The ID of the student to assign
           */
          setStudentToModuleEvaluation(taskId: UUID, studentId: UUID) {
            set(
              (state) => {
                ensureCollectionsInDraft(state);
                const student = state.students.get(studentId);

                for (const module of state.modules.values()) {
                  if (module.tasksList.has(taskId)) {
                    const toEvaluate = (module.studentsToEvaluate ??=
                      new Set<UUID>());

                    if (student?.isPresent) {
                      toEvaluate.add(studentId);
                    } else {
                      toEvaluate.delete(studentId);
                    }
                  }
                }
              },
              undefined,
              "setStudentToModuleEvaluation",
            );
          },
          /**
           * Clear a student from all module evaluations.
           *
           * @description Used when a student's presence is toggled off.
           *
           * @param studentId - The ID of the student to clear
           */
          clearStudentFromModuleEvaluation(studentId: UUID) {
            set(
              (state) => {
                ensureCollectionsInDraft(state);

                for (const module of state.modules.values()) {
                  const toEvaluate = module.studentsToEvaluate;
                  if (toEvaluate?.has(studentId)) {
                    toEvaluate.delete(studentId);
                  }
                }
              },
              undefined,
              "clearStudentFromModuleEvaluation",
            );
          },
          /**
           * Set the current module selection state.
           *
           * @param isClicked - Whether a module has been clicked
           * @param selectedModuleIndex - The index of the selected module
           * @param selectedModule - The selected module details
           */
          setModuleSelection(args: ModulesSelectionType) {
            const { isClicked, selectedModuleIndex, selectedModuleId } = args;

            set(
              (state) => {
                const selection = state.moduleSelection;

                state.moduleSelection = {
                  ...selection,
                  isClicked,
                  selectedModuleIndex,
                  selectedModuleId,
                };
              },
              undefined,
              "setModuleSelection",
            );
          },
          /**
           * Set the module selection "isClicked" state.
           *
           * @param isClicked - Whether a module has been clicked
           */
          setModuleSelectionIsClicked(isClicked: boolean) {
            set(
              (state) => {
                state.moduleSelection.isClicked = isClicked;
              },
              undefined,
              "setModuleSelectionIsClicked",
            );
          },
          /**
           * Set the subskill selection state.
           * @param args - The subskill selection details
           */
          setSubskillSelection(args: SubskillSelectionType) {
            const { isClicked, selectedSubSkillIndex, selectedSubSkillId } =
              args;

            set(
              (state) => {
                const selection = state.subSkillSelection;
                const moduleId = state.moduleSelection.selectedModuleId;
                const module = moduleId ? state.modules.get(moduleId) : null;

                if (!selectedSubSkillId || !module) {
                  return;
                }

                // Ensure the selected subskill belongs to the selected module
                if (!module.subSkills.has(selectedSubSkillId)) {
                  return;
                }

                state.subSkillSelection = {
                  ...selection,
                  isClicked,
                  selectedSubSkillIndex,
                  selectedSubSkillId,
                };
              },
              undefined,
              "setSubskillSelection",
            );
          },
          /**
           * Set evaluation for student
           *
           * @param studentId - The ID of the student
           * @param evaluation - The evaluation details
           * @remarks This function updates the evaluation score for a specific student's module and sub-skill.
           */
          setEvaluationForStudent(studentId: UUID, evaluation: EvaluationType) {
            const { subSkill, module, score } = evaluation;

            if (!subSkill?.id || !module?.id || !studentId || score == null) {
              return;
            }

            const newSubSkillItem = {
              id: subSkill.id,
              name: subSkill.name,
              code: subSkill.code,
              score,
            };

            set(
              (state) => {
                ensureCollectionsInDraft(state);
                const student = state.students.get(studentId);
                if (!student) return;

                let existingStudentEvaluation = student?.evaluations;

                if (!existingStudentEvaluation) {
                  existingStudentEvaluation = {
                    modules: new UniqueSet(),
                  };
                  student.evaluations = existingStudentEvaluation;
                }

                const modulesList = existingStudentEvaluation?.modules;
                const existingModuleSet = modulesList.get(module.id);

                if (existingModuleSet) {
                  updateEvaluationScore(
                    existingModuleSet,
                    newSubSkillItem,
                    modulesList,
                  );
                } else {
                  addNewEvaluationScore(
                    existingStudentEvaluation,
                    module,
                    newSubSkillItem,
                    modulesList,
                  );

                  existingStudentEvaluation.modules = modulesList;
                }
              },
              undefined,
              "setEvaluationForStudent",
            );
          },
          /**
           * Disable a sub-skill if no students are to be evaluated for it.
           *
           * @param selectedModuleId - The ID of the selected module
           */
          disableSubSkillsWithoutStudents(moduleId?: UUID) {
            if (!moduleId) return;
            ensureCollections();
            const module = get().modules.get(moduleId);
            const subSkills = module?.subSkills;

            if (!module || !subSkills) return;

            const values = Array.from(subSkills.values() ?? []);

            const enabledSubSkills: ClassModuleSubSkill[] = [];
            const disabledSubSkills: ClassModuleSubSkill[] = [];

            values.forEach((subSkill) => {
              const noStudentsAvailable =
                ACTIONS.getPresentStudentsWithAssignedTasks(subSkill.id)
                  .length === 0;

              filterSubSkillsBasedOnStudentsAvailability(
                noStudentsAvailable,
                subSkill,
                disabledSubSkills,
                enabledSubSkills,
              );
            });

            set(
              (state) => {
                ensureCollectionsInDraft(state);
                const reordered = new UniqueSet<UUID, ClassModuleSubSkill>(
                  null,
                  [...enabledSubSkills, ...disabledSubSkills],
                );
                updateModules(state, module, { subSkills: reordered });
              },
              undefined,
              "disableSubSkillsWithoutStudents",
            );
          },
          /**
           * Get modules that have students assigned for evaluation.
           *
           * @returns Array of modules with students to evaluate.
           */
          getAttendedModules() {
            ensureCollections();
            return Array.from(get().modules?.values() ?? []).filter(
              (module) => (module.studentsToEvaluate?.size ?? 0) > 0,
            );
          },
          /**
           * Get students presence selection data for UI components.
           *
           * @returns Array of students with presence and task assignment details.
           */
          getStudentsPresenceSelectionData(): NonLabelledGroupItemProps[] {
            ensureCollections();
            const values = Array.from(get().students?.values() ?? []);

            const students = new ObjectReshape(values || [])
              .assign([
                ["fullName", "title"],
                ["isPresent", "isSelected"],
              ])
              .newShape() as StudentWithPresence[];

            return students.map((student, index) => ({
              ...student,
              name: `students.${index}.taskId`,
              defaultValue: student.assignedTask?.id ?? undefined,
              items: Array.from(get().tasks?.values() ?? []).map((task) => ({
                id: task.id,
                name: task.name,
              })),
            }));
          },
          /**
           * Get the evaluation score for a student for a specific sub-skill.
           */
          getStudentScoreForSubSkill(
            studentId: UUID,
            subSkillId: UUID | undefined,
            moduleId: UUID | undefined,
          ): number[] {
            ensureCollections();

            if (!moduleId || !subSkillId) return [0];

            const student = get().students?.get(studentId);
            const studentEvaluations = student?.evaluations;
            const moduleEvaluation = studentEvaluations?.modules.get(moduleId);

            if (!studentEvaluations || !moduleEvaluation) return [0];

            const subSkillEvaluation =
              moduleEvaluation.subSkills.get(subSkillId);

            if (subSkillEvaluation?.score) {
              return [subSkillEvaluation.score];
            }

            return [0];
          },
          /**
           * Get all modules of the selected class.
           */
          getSelectedClassModules() {
            ensureCollections();
            return Array.from(get().modules?.values() ?? []);
          },
          /**
           * Get the currently selected module from the core store.
           */
          getSelectedModule(moduleId?: UUID) {
            ensureCollections();
            const selectedModuleId =
              moduleId ?? get().moduleSelection.selectedModuleId;

            if (!selectedModuleId) return null;

            return get().modules.get(selectedModuleId) ?? null;
          },
          /**
           * Get the sub-skills for the currently selected module.
           */
          getSelectedModuleSubSkills(moduleId?: UUID) {
            ensureCollections();
            const module = ACTIONS.getSelectedModule(moduleId);

            if (!module) return [];

            return Array.from(module.subSkills.values());
          },
          /**
           * Get the currently selected sub-skill from the core store.
           */
          getSelectedSubSkill(subSkillId?: UUID, moduleId?: UUID) {
            ensureCollections();
            const selectedSubSkillId =
              subSkillId ?? get().subSkillSelection.selectedSubSkillId;

            const module = ACTIONS.getSelectedModule(moduleId);

            if (!module || !selectedSubSkillId) return null;

            return module.subSkills.get(selectedSubSkillId) ?? null;
          },
          /**
           * Get all students' scores for average calculation.
           */
          getAllStudentsAverageScores() {
            ensureCollections();
            const students = get().students;
            const scores = new UniqueSet<
              UUID,
              { name: string; score: number }
            >();

            for (const student of students.values()) {
              if (!student.isPresent) continue;

              const averageScore = getStudentAverageScore(student);
              const score =
                student.overallScore != null
                  ? student.overallScore * 5
                  : averageScore;

              scores.set(student.id, {
                name: student.fullName,
                score,
              });
            }

            return scores;
          },
          /**
           * Verify if all of the students for a selected subskill from a module have been scored.
           *
           * @param subSkillId - The ID of the sub-skill to check (optional, if not provided it will use the currently selected sub-skill in the store)
           * @param moduleId - The ID of the module to check (optional, if not provided it will use the currently selected module in the store)
           *
           * @returns True if all students have been scored for the sub-skill, otherwise false.
           */
          isThisSubSkillCompleted(subSkillId?: UUID, moduleId?: UUID) {
            const selectedModuleId =
              moduleId ?? get().moduleSelection.selectedModuleId;
            const selectedSubSkillId =
              subSkillId ?? get().subSkillSelection.selectedSubSkillId;

            if (!selectedModuleId || !selectedSubSkillId) return false;

            const presentStudents = ACTIONS.getPresentStudentsWithAssignedTasks(
              selectedSubSkillId,
              selectedModuleId,
            );

            // This sub-skill has no students to evaluate
            // And should be considered as isDisabled instead of completed
            if (presentStudents.length === 0) {
              return false;
            }

            for (const student of presentStudents) {
              if (!student) continue;

              const hasScore = isThisStudentAlreadyEvaluatedForThisSubSkill(
                student,
                selectedModuleId,
                selectedSubSkillId,
              );

              if (!hasScore) {
                return false;
              }
            }

            return true;
          },
          /**
           * Check and update the completion status of all modules based on their sub-skills.
           */
          checkForCompletedModules() {
            set(
              (state) => {
                ensureCollectionsInDraft(state);
                const modules = Array.from(state.modules?.values() ?? []);

                if (modules.length === 0) return;

                modules.forEach((module) => {
                  const subSkillsValues = Array.from(
                    module.subSkills.values() ?? [],
                  );
                  const completedCount = subSkillsValues.filter(
                    isSubSkillCompletedOrDisabled,
                  ).length;

                  const isCompleted = completedCount === module.subSkills.size;

                  if (module.isCompleted !== isCompleted) {
                    updateModules(state, module, { isCompleted });
                  }
                });
              },
              undefined,
              "checkForCompletedModules",
            );
          },
          /**
           * Recalculate sub-skill and module completion for affected tasks.
           *
           * @param taskIds - The task IDs that may impact module completion.
           */
          refreshCompletionForTasks(taskIds: Array<UUID>) {
            ensureCollections();
            const affectedModules = Array.from(get().modules.values()).filter(
              (module) =>
                taskIds.some((taskId) => module.tasksList.has(taskId)),
            );

            affectedModules.forEach((module) => {
              for (const subSkill of module.subSkills.values()) {
                if (!subSkill.id || !module.id) continue;

                if (subSkill.isCompleted !== false) {
                  ACTIONS.setSubSkillHasCompleted(
                    module.id,
                    subSkill.id,
                    false,
                  );
                }
              }
            });
          },
          /**
           * Set the completed flag for a module's sub-skill.
           *
           * @param moduleId - The ID of the module
           * @param subSkillId - The ID of the sub-skill
           * @param completed - Whether the sub-skill is completed
           */
          setSubSkillHasCompleted(
            moduleId: UUID,
            subSkillId: UUID,
            completed: boolean,
          ) {
            ensureCollections();
            const module = get().modules.get(moduleId);
            const subSkill = module?.subSkills.get(subSkillId);

            if (!module || !subSkill || subSkill.isCompleted === completed)
              return;

            const updatedSubSkill = {
              ...subSkill,
              isCompleted: completed,
            };

            const newSubskills = preparedSubSkillsForUpdate(
              updatedSubSkill,
              module,
              null,
              false,
            );

            set(
              (state) => {
                ensureCollectionsInDraft(state);

                updateModules(state, module, { subSkills: newSubskills });
              },
              undefined,
              "setSubSkillHasCompleted",
            );
          },
          /**
           * Verify that all modules are completed (or disabled) before allowing finalization of the evaluation.
           *
           * @returns True if all modules are completed or disabled, otherwise false.
           */
          areAllModulesCompleted() {
            ensureCollections();

            const attendedModules = ACTIONS.getAttendedModules();

            return attendedModules.every((module) => module.isCompleted);
          },
          /**
           * FOR SUBSKILLS - CONTROLLER USE ONLY
           *
           * Students with assigned tasks for the selected subskill.
           *
           * @description Student must be present
           *
           * @param subSkillId - The ID of the selected sub-skill (optional, if not provided it will use the currently selected sub-skill in the store)
           * @param moduleId - The ID of the selected module (optional, if not provided it will use the currently selected module in the store)
           *
           * @returns Array of students who are present and have assigned tasks related to the selected subskill.
           */
          getPresentStudentsWithAssignedTasks(
            subSkillId?: UUID,
            moduleId?: UUID,
          ) {
            ensureCollections();

            const selectedSubSkillId =
              subSkillId ?? get().subSkillSelection?.selectedSubSkillId;
            const selectedModuleId =
              moduleId ?? get().moduleSelection?.selectedModuleId;

            if (!selectedSubSkillId) return [];

            const students = Array.from(get().students?.values() ?? []);
            const selectedModule = selectedModuleId
              ? get().modules?.get(selectedModuleId)
              : null;

            const modules = selectedModule
              ? [selectedModule]
              : Array.from(get().modules?.values() ?? []);

            return students.filter((student) => {
              const { assignedTask, isPresent, id } = student;
              return (
                isPresent &&
                assignedTask !== null &&
                modules?.some(
                  (module) =>
                    module.subSkills.has(selectedSubSkillId) &&
                    module.tasksList.has(assignedTask!.id) &&
                    module.studentsToEvaluate?.has(id) &&
                    module.subSkills
                      .get(selectedSubSkillId)
                      ?.isLinkedToTasks?.has(assignedTask!.id),
                )
              );
            });
          },
          getAllPresentStudents() {
            ensureCollections();

            const students = Array.from(get().students?.values() ?? []);

            return students.filter((student) => student.isPresent);
          },
        };
        return ACTIONS;
      }),
    ),
    {
      // name: "evaluation-steps-creation",
      // anonymousActionTypes: false,
      serialize: { options: { map: true, set: true } },
      enabled: DEV_MODE,
      predicate: (_state, action) =>
        !/^evalSteps\/debug\/rehydrateCollections$/.test(action?.type ?? ""),
      store: "evalSteps",
    },
  ),
);
