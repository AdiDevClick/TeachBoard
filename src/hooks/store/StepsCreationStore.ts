import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { StudentDto } from "@/api/types/routes/students.types.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type StudentWithPresence = {
  id: StudentDto["id"];
  fullName: string;
  isPresent: boolean;
  task: string;
};

export interface StepsCreationState {
  /** Full class summary */
  selectedClass?: ClassSummaryDto | null;
  diplomaName?: string | null;
  className?: string | null;
  id?: UUID | null;
  description?: string | null;
  students?: StudentWithPresence[] | null;
  templates?: ClassSummaryDto["templates"] | null;
  evaluations?: unknown[] | null;
}

export interface StepsCreationActions {
  setSelectedClass(selectedClass: ClassSummaryDto): void;
  setDiplomaName(name: string): void;
  setStudents(students: ClassSummaryDto["students"]): void;
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
          templates: null,
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
              state.templates = selectedClass.templates;
              state.evaluations = selectedClass.evaluations;
              state.className = selectedClass.name;
            });
            get().setStudents(selectedClass.students);
          },
          setDiplomaName(name: string) {
            set((state) => {
              state.diplomaName = name;
            });
          },
          setStudents(students: ClassSummaryDto["students"]) {
            set((state) => {
              state.students = (students || []).map((student) => ({
                id: student.id,
                fullName: student.firstName + " " + student.lastName,
                isPresent: false,
                task: null,
              }));
            });
          },
        })
      )
    )
  )
);
