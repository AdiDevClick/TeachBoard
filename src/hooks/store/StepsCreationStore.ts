import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { TemplateSkillsViewDto } from "@/api/types/routes/skills.types.ts";
import { ObjectReshape } from "@/utils/ObjectReshape.ts";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type StudentWithPresence = {
  id: UUID;
  fullName: string;
  isPresent: boolean;
  assignedTask?: { id: UUID; name: string | null } | null;
};

export type ClassTasks = {
  id: UUID;
  name: string | null;
  skills: TemplateSkillsViewDto[];
};

export interface StepsCreationState {
  /** Full class summary */
  selectedClass?: ClassSummaryDto | null;
  diplomaName?: string | null;
  className?: string | null;
  id?: UUID | null;
  description?: string | null;
  students?: UniqueSet<UUID, StudentWithPresence> | null;
  tasks?: UniqueSet<UUID, ClassTasks> | null;
  evaluations?: unknown[] | null;
}

export interface StepsCreationActions {
  setSelectedClass(selectedClass: ClassSummaryDto): void;
  setDiplomaName(name: string): void;
  setStudents(students: ClassSummaryDto["students"]): void;
  setClassTasks(tasks: ClassSummaryDto["templates"]): void;
}

export type StepsCreationStore = StepsCreationState & StepsCreationActions;

export const useStepsCreationStore = create(
  devtools(
    immer(
      combine(
        {
          id: null,
          description: null,
          students: null,
          tasks: null,
          evaluations: null,
          diplomaName: null,
          className: null,
          selectedClass: null,
        } as StepsCreationStore,
        (set, get) => ({
          setSelectedClass(selectedClass: ClassSummaryDto) {
            set((state) => {
              state.selectedClass = selectedClass;
              state.id = selectedClass.id || null;
              state.description = selectedClass.description || null;
              state.evaluations = selectedClass.evaluations;
              state.className = selectedClass.name;
            });
            get().setStudents(selectedClass.students);
            get().setClassTasks(selectedClass.templates);
          },
          setClassTasks(tasks: ClassSummaryDto["templates"]) {
            set((state) => {
              const mappedTasks = (tasks || []).map((task) => ({
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
              const mappedStudents = (students || []).map((student) => ({
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
        })
      )
    )
  )
);
