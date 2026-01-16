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
            // Populate modules for the selected class
            if (selectedClass.modules)
              ACTIONS.setModules(selectedClass.modules);
          },
          setClassTasks(tasks: ClassSummaryDto["templates"]) {
            set((state) => {
              state.tasks ??= new UniqueSet();
              tasks.forEach((task) => {
                const details = {
                  id: task.id,
                  name: task.taskName ?? null,
                  modules: task.modules ?? [],
                };
                state.tasks.set(task.id, details);
              });
            });
          },
          setModules(modules: ClassSummaryDto["modules"]) {
            set((state) => {
              // state.modules ??= new UniqueSet();
              modules.forEach((m) => {
                const details = {
                  id: m.id,
                  code: m.code ?? "",
                  name: m.name ?? null,
                  subSkills: m.subSkills ?? [],
                };
                state.modules.set(m.id, details);
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
              state.students ??= new UniqueSet();
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
        };
        return ACTIONS;
      })
    )
  )
);
