import {
  DEFAULT_VALUES_STEPS_CREATION_STATE,
  useEvaluationStepsCreationStore,
} from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { beforeEach, describe, expect, it } from "vitest";

describe("StepsCreationStore - students reshape", () => {
  beforeEach(() => {
    // reset relevant parts of the store
    useEvaluationStepsCreationStore.setState(
      DEFAULT_VALUES_STEPS_CREATION_STATE,
    );
  });

  it("getStudentsPresenceSelectionData returns mapped fields and items", () => {
    const studentsPayload = [{ id: "1", firstName: "John", lastName: "Stud" }];

    const templates = [{ id: "t1", taskName: "T1", modules: [] }];

    // Populate store
    useEvaluationStepsCreationStore
      .getState()
      .setStudents(studentsPayload as any);
    useEvaluationStepsCreationStore.getState().setClassTasks(templates as any);

    const result = useEvaluationStepsCreationStore
      .getState()
      .getStudentsPresenceSelectionData();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].title).toBe("John Stud");
    expect(result[0].isSelected).toBe(false);
    expect(result[0].items[0].name).toBe("T1");
  });

  it("updates students task selection signal when a task changes without reordering students", () => {
    const studentsPayload = [
      { id: "1", firstName: "John", lastName: "Stud" },
      { id: "2", firstName: "Jane", lastName: "Learner" },
    ];

    const templates = [{ id: "t1", taskName: "T1", modules: [] }];

    // Populate store
    useEvaluationStepsCreationStore
      .getState()
      .setStudents(studentsPayload as any);
    useEvaluationStepsCreationStore.getState().setClassTasks(templates as any);

    const initialOrder = Array.from(
      useEvaluationStepsCreationStore.getState().students.values(),
    ).map((s) => s.id);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence("1" as any, true);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment("t1" as any, "1" as any);

    const studentsAfter = Array.from(
      useEvaluationStepsCreationStore.getState().students.values(),
    );

    const signal = studentsAfter
      .map(
        (student) =>
          `${student.id}:${student.isPresent ? "1" : "0"}:${student.assignedTask?.id ?? "none"}`,
      )
      .join("|");

    expect(signal).toContain("1:1:t1");
    expect(studentsAfter.map((s) => s.id)).toEqual(initialOrder);
  });

  it("updates students task selection signal when presence toggles back to present while keeping the assignment", () => {
    const studentsPayload = [{ id: "1", firstName: "John", lastName: "Stud" }];

    const templates = [{ id: "t1", taskName: "T1", modules: [] }];

    // Populate store
    useEvaluationStepsCreationStore
      .getState()
      .setStudents(studentsPayload as any);
    useEvaluationStepsCreationStore.getState().setClassTasks(templates as any);

    const initialOrder = Array.from(
      useEvaluationStepsCreationStore.getState().students.values(),
    ).map((s) => s.id);

    // set presence true, assign task, mark absent, then present again
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence("1" as any, true);
    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment("t1" as any, "1" as any);

    // mark absent
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence("1" as any, false);

    let studentsAfter = Array.from(
      useEvaluationStepsCreationStore.getState().students.values(),
    );

    let signal = studentsAfter
      .map(
        (student) =>
          `${student.id}:${student.isPresent ? "1" : "0"}:${student.assignedTask?.id ?? "none"}`,
      )
      .join("|");

    expect(signal).toContain("1:0:t1");

    // set presence true again without reassigning
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence("1" as any, true);

    studentsAfter = Array.from(
      useEvaluationStepsCreationStore.getState().students.values(),
    );

    signal = studentsAfter
      .map(
        (student) =>
          `${student.id}:${student.isPresent ? "1" : "0"}:${student.assignedTask?.id ?? "none"}`,
      )
      .join("|");

    expect(signal).toContain("1:1:t1");
    expect(studentsAfter.map((s) => s.id)).toEqual(initialOrder);
  });
});
