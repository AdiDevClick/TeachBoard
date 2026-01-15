import type {
  StepsCreationStore,
  StudentWithPresence,
} from "@/api/store/types/steps-creation-store.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import { ObjectReshape } from "@/utils/ObjectReshape.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_VALUES = {
  id: null,
  description: null,
  students: new UniqueSet(),
  tasks: new UniqueSet(),
  evaluations: null,
  diplomaName: null,
  className: null,
  selectedClass: null,
} as StepsCreationStore;

export const useStepsCreationStore = create(
  devtools(
    immer(
      combine(DEFAULT_VALUES, (set, get) => ({
        clear: () => set(() => ({ ...DEFAULT_VALUES })),
        setSelectedClass(selectedClass: ClassSummaryDto) {
          set((state) => {
            state.selectedClass = selectedClass;
            state.id = selectedClass.id || null;
            state.description = selectedClass.description || null;
            state.evaluations = selectedClass.evaluations || null;
            state.className = selectedClass.name;
          });
          get().setStudents(selectedClass.students);
          get().setClassTasks(selectedClass.templates);
        },
        setClassTasks(tasks: ClassSummaryDto["templates"]) {
          set((state) => {
            const mappedTasks = tasks.map((task) => ({
              id: task.id,
              name: task.taskName ?? null,
              skills: task.skills ?? [],
            }));
            state.tasks = new UniqueSet(null, mappedTasks);
          });
        },
        setDiplomaName(name: string) {
          set((state) => {
            state.diplomaName = name;
          });
        },
        setStudents(students: ClassSummaryDto["students"]) {
          set((state) => {
            const mappedStudents = students.map((student) => ({
              id: student.id,
              fullName: student.firstName + " " + student.lastName,
              isPresent: false,
              assignedTask: null,
            }));
            state.students = new UniqueSet(null, mappedStudents);
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
      }))
    )
  )
);
