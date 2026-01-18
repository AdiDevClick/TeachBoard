import type {
  StepsCreationState,
  StudentWithPresence,
} from "@/api/store/types/steps-creation-store.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import { ObjectReshape } from "@/utils/ObjectReshape.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_VALUES: StepsCreationState = {
  id: null,
  description: null,
  students: new UniqueSet(),
  tasks: new UniqueSet(),
  evaluations: null,
  diplomaName: null,
  className: null,
  selectedClass: null,
  modules: new UniqueSet(),
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
      combine(DEFAULT_VALUES, (set, get) => {
        const ACTIONS = {
          clear: () => set(() => ({ ...DEFAULT_VALUES })),
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
              // state.tasks ??= new UniqueSet();
              tasks.forEach((task) => {
                const details = {
                  id: task.id,
                  name: task.taskName ?? null,
                  modules: task.modules ?? [],
                };
                state.tasks.set(task.id, details);
                ACTIONS.setModules(task.modules);
              });
            });
          },
          setModules(modules: ClassSummaryDto["templates"][number]["modules"]) {
            set((state) => {
              (modules ?? []).forEach((module) => {
                if (!module.id) return;
                const { subSkills, ...rest } = module;

                // Save or update module without subSkills first
                state.modules.set(module.id, rest);
                // state.modules.set(module.id, rest);
                const savedModule = state.modules.get(module.id);

                if (!savedModule) return;

                // We now have the possibility to use a hash set for subSkills
                if (savedModule.subSkills === undefined) {
                  savedModule.subSkills = new UniqueSet(null, subSkills);
                } else {
                  for (const subSkill of subSkills ?? []) {
                    savedModule.subSkills.set(subSkill.id, subSkill);
                  }
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
              // state.students ??= new UniqueSet();
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
          getStudentsPresenceSelectionData() {
            // Makes sure the component using this data is compatible with its structure
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
          getSelectedClassModules() {
            return Array.from(get().modules?.values() ?? []);
          },
        };
        return ACTIONS;
      }),
    ),
  ),
);
