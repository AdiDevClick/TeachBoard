import type {
  SetModulesSelectionType,
  StepsCreationState,
  StudentWithPresence,
  SubskillSelectionType,
} from "@/api/store/types/steps-creation-store.types";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { SkillsType } from "@/api/types/routes/skills.types.ts";
import { ObjectReshape } from "@/utils/ObjectReshape.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const DEFAULT_VALUES_STEPS_CREATION_STATE: StepsCreationState = {
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
    selectedModule: null,
    selectedModuleSubSkills: [],
  },
  subSkillSelection: {
    isClicked: false,
    selectedSubSkillIndex: null,
    selectedSubSkill: null,
  },
};

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
          clear: () => set(() => ({ ...DEFAULT_VALUES_STEPS_CREATION_STATE })),
          setSelectedClass(selectedClass: ClassSummaryDto) {
            set((state) => {
              state.selectedClass = selectedClass;
              state.id = selectedClass.id || null;
              state.description = selectedClass.description || null;
              state.evaluations = selectedClass.evaluations || null;
              state.className = selectedClass.name;
            });
            ACTIONS.setStudents(selectedClass.students);
            ACTIONS.setClassTasks(selectedClass.templates);
          },
          setClassTasks(tasks: ClassSummaryDto["templates"]) {
            set((state) => {
              tasks.forEach((task) => {
                const details = {
                  id: task.id,
                  name: task.taskName ?? null,
                  modules: task.modules ?? [],
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

                  for (const subSkill of subSkills ?? []) {
                    savedModule.subSkills.set(subSkill.id, subSkill);
                  }
                } else {
                  const newProperties = {
                    ...rest,
                    subSkills: new UniqueSet<UUID, SkillsType>(null, subSkills),
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
                  //   student.assignedTask = null;
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
            set((state) => {
              const student = state.students.get(studentId) ?? null;
              const task = state.tasks.get(taskId) ?? null;

              if (student && task) {
                student.assignedTask = { id: task.id, name: task.name };

                ACTIONS.setStudentToModuleEvaluation(taskId, studentId);
              }
            });
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
                  if (student?.isPresent) {
                    module.studentsToEvaluate ??= new Set<UUID>();
                    module.studentsToEvaluate.add(studentId);
                  } else {
                    module.studentsToEvaluate?.delete(studentId);
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
                if (module.studentsToEvaluate?.has(studentId)) {
                  module.studentsToEvaluate?.delete(studentId);
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
          setModuleSelection(args: SetModulesSelectionType) {
            const { isClicked, selectedModuleIndex, selectedModule } = args;

            set((state) => {
              const selection = state.moduleSelection;
              const { subSkills, ...moduleWithoutSubSkills } = selectedModule;

              selection.isClicked = isClicked;

              selection.selectedModuleIndex = selectedModuleIndex;

              selection.selectedModule = moduleWithoutSubSkills;

              selection.selectedModuleSubSkills = Array.from(
                subSkills?.values() ?? [],
              );
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
            const { isClicked, selectedSubSkillIndex, selectedSubSkill } = args;
            set((state) => {
              const selection = state.subSkillSelection;

              selection.isClicked = isClicked;
              selection.selectedSubSkillIndex = selectedSubSkillIndex;
              selection.selectedSubSkill = selectedSubSkill;
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
        };
        return ACTIONS;
      }),
    ),
  ),
);
