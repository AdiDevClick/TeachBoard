import {
  addNewEvaluationScore,
  buildLinkedSubSkills,
  filterSubSkillsBasedOnStudentsAvailability,
  isThisStudentAlreadyEvaluatedForThisSubSkill,
  preparedSubSkillsForUpdate,
  updateEvaluationScore,
  updateModules,
  upsertModuleSubSkills,
} from "@/api/store/functions/evaluation-store.functions.ts";
import type {
  ClassModuleSubSkill,
  EvaluationType,
  ModulesSelectionType,
  StepsCreationState,
  StudentWithPresence,
  SubskillSelectionType,
} from "@/api/store/types/steps-creation-store.types";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type {
  SkillsType,
  SkillsViewDto,
} from "@/api/types/routes/skills.types.ts";
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
        const ACTIONS = {
          clear: (classId: UUID) => {
            if (get().selectedClass?.id === classId) {
              return false;
            }

            set(createDefaultStepsCreationState());

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

            set((state) => {
              const { id, description, evaluations, name } = selectedClass;

              return {
                ...state,
                selectedClass,
                id: id || null,
                description: description || null,
                evaluations: evaluations || null,
                className: name || null,
              };
            });

            ACTIONS.setStudents(selectedClass.students);
            ACTIONS.setClassTasks(selectedClass.templates);
          },
          clearSelectedClass(classId?: UUID) {
            set((state) => {
              if (state.selectedClass?.id === classId) {
                return state;
              }
              state.selectedClass = null;
              state.description = null;
            });
          },
          setClassTasks(tasks: ClassSummaryDto["templates"]) {
            set((state) => {
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
                ACTIONS.setModules(task.modules, task.id);
              });
            });
          },
          /**
           * @remarks In case a module is used in multiple tasks, this ensures no duplication occurs and the module is enriched with all associated task ID's.
           *
           * Stores the modules from a class template into the store.
           *
           * @param modules - The modules to set
           * @param taskId - The task ID associated with the modules
           */
          setModules(
            modules: ClassSummaryDto["templates"][number]["modules"],
            taskId: UUID,
          ) {
            set((state) => {
              (modules ?? []).forEach((module) => {
                if (!module.id) return;
                const { subSkills, ...rest } = module;

                // Save or update module without subSkills first
                const savedModule = state.modules.get(module.id);

                if (savedModule) {
                  savedModule.tasksList.add(taskId);
                  upsertModuleSubSkills(savedModule, subSkills, taskId);
                } else {
                  const newProperties = {
                    ...rest,
                    subSkills: new UniqueSet<UUID, SkillsType>(
                      null,
                      buildLinkedSubSkills(subSkills, taskId),
                    ),
                    tasksList: new Set([taskId]),
                  };

                  state.modules.set(module.id, newProperties);
                }
              });
            });
          },
          setDiplomaName(name: string) {
            set((state) => {
              state.diplomaName = name;
            });
          },
          setStudents(students: ClassSummaryDto["students"]) {
            set((state) => {
              students.forEach((student) => {
                const details = {
                  id: student.id,
                  fullName: student.firstName + " " + student.lastName,
                  isPresent: false,
                  assignedTask: null,
                };
                state.students.set(student.id, details);
              });
            });
          },
          setStudentPresence(studentId: UUID, isPresent: boolean) {
            set((state) => {
              const student = state.students.get(studentId) ?? null;

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
              }
            });
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

            const student = get().students.get(studentId);
            const task = get().tasks.get(taskId);
            const studentEvaluations = student?.evaluations;

            if (student?.assignedTask?.id === taskId) {
              return;
            }

            // If the student has existing evaluations, remove any scores related to the previous task's modules
            if (studentEvaluations) {
              for (const module of task?.modules.values() ?? []) {
                if (!module.id) continue;
                studentEvaluations.modules.delete(module.id);
              }
            }

            if (student && task) {
              student.assignedTask = { id: task.id, name: task.name };

              ACTIONS.setStudentToModuleEvaluation(taskId, studentId);
            }
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
            set((state) => {
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
            });
          },
          /**
           * Clear a student from all module evaluations.
           *
           * @description Used when a student's presence is toggled off.
           *
           * @param studentId - The ID of the student to clear
           */
          clearStudentFromModuleEvaluation(studentId: UUID) {
            set((state) => {
              for (const module of state.modules.values()) {
                const toEvaluate = module.studentsToEvaluate;
                if (toEvaluate?.has(studentId)) {
                  toEvaluate.delete(studentId);
                }
              }
            });
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

            set((state) => {
              const selection = state.moduleSelection;

              state.moduleSelection = {
                ...selection,
                isClicked,
                selectedModuleIndex,
                selectedModuleId,
              };
            });
          },
          /**
           * Set the module selection "isClicked" state.
           *
           * @param isClicked - Whether a module has been clicked
           */
          setModuleSelectionIsClicked(isClicked: boolean) {
            set((state) => {
              state.moduleSelection.isClicked = isClicked;
            });
          },
          /**
           * Set the subskill selection state.
           * @param args - The subskill selection details
           */
          setSubskillSelection(args: SubskillSelectionType) {
            const { isClicked, selectedSubSkillIndex, selectedSubSkillId } =
              args;

            set((state) => {
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
            });
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

            set((state) => {
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
            });
          },
          /**
           * Disable a sub-skill if no students are to be evaluated for it.
           *
           * @param selectedModuleId - The ID of the selected module
           */
          disableSubSkillsWithoutStudents(moduleId?: UUID) {
            if (!moduleId) return;
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

            set((state) => {
              const reordered = new UniqueSet<UUID, ClassModuleSubSkill>(null, [
                ...enabledSubSkills,
                ...disabledSubSkills,
              ]);
              updateModules(state, module, { subSkills: reordered });
            });
          },
          /**
           * Get modules that have students assigned for evaluation.
           *
           * @returns Array of modules with students to evaluate.
           */
          getAttendedModules() {
            return Array.from(get().modules?.values() ?? []).filter(
              (module) => (module.studentsToEvaluate?.size ?? 0) > 0,
            );
          },
          /**
           * Get students presence selection data for UI components.
           *
           * @returns Array of students with presence and task assignment details.
           */
          getStudentsPresenceSelectionData() {
            const values = Array.from(get().students?.values() ?? []);

            const students = new ObjectReshape(values || [])
              .assign([
                ["fullName", "title"],
                ["isPresent", "isSelected"],
              ])
              .newShape() as StudentWithPresence[];

            return students.map((student) => ({
              ...student,
              defaultValue: student.assignedTask?.id ?? undefined,
              items: Array.from(get().tasks?.values() ?? []).map((task) => ({
                id: task.id,
                name: task.name,
              })),
            }));
          },
          /**
           * Get all modules of the selected class.
           */
          getSelectedClassModules() {
            return Array.from(get().modules?.values() ?? []);
          },
          /**
           * Get the currently selected module from the core store.
           */
          getSelectedModule(moduleId?: UUID) {
            const selectedModuleId =
              moduleId ?? get().moduleSelection.selectedModuleId;

            if (!selectedModuleId) return null;

            return get().modules.get(selectedModuleId) ?? null;
          },
          /**
           * Get the sub-skills for the currently selected module.
           */
          getSelectedModuleSubSkills(moduleId?: UUID) {
            const module = ACTIONS.getSelectedModule(moduleId);

            if (!module) return [];

            return Array.from(module.subSkills.values());
          },
          /**
           * Get the currently selected sub-skill from the core store.
           */
          getSelectedSubSkill(subSkillId?: UUID, moduleId?: UUID) {
            const selectedSubSkillId =
              subSkillId ?? get().subSkillSelection.selectedSubSkillId;

            const module = ACTIONS.getSelectedModule(moduleId);

            if (!module || !selectedSubSkillId) return null;

            return module.subSkills.get(selectedSubSkillId) ?? null;
          },
          /**
           * Verify if all of the students for a selected subskill from a module have been scored.
           *
           * @param subSkillId - The ID of the sub-skill to check
           * @returns True if all students have been scored for the sub-skill, otherwise false.
           */
          isThisSubSkillCompleted(subSkillId?: UUID, moduleId?: UUID) {
            const selectedModuleId =
              moduleId ?? get().moduleSelection.selectedModuleId;
            const selectedSubSkillId =
              subSkillId ?? get().subSkillSelection.selectedSubSkillId;

            if (!selectedModuleId || !selectedSubSkillId) return false;

            const presentStudents =
              ACTIONS.getPresentStudentsWithAssignedTasks(selectedSubSkillId);

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

            set((state) => {
              updateModules(state, module, { subSkills: newSubskills });
            });
          },
          /**
           * FOR SUBSKILLS - CONTROLLER USE ONLY
           *
           * Students with assigned tasks for the selected subskill.
           *
           * @description Student must be present
           *
           * @returns Array of students who are present and have assigned tasks related to the selected subskill.
           */
          getPresentStudentsWithAssignedTasks(subSkillId?: UUID) {
            const selectedSubSkillId =
              subSkillId ?? get().subSkillSelection?.selectedSubSkillId;

            if (!selectedSubSkillId) return [];

            const students = Array.from(get().students?.values() ?? []);
            const modules = Array.from(get().modules?.values() ?? []);

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
        };
        return ACTIONS;
      }),
    ),
  ),
);
