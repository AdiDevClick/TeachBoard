import {
  DEFAULT_VALUES_STEPS_CREATION_STATE,
  useEvaluationStepsCreationStore,
} from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import {
  CLASS_ID,
  CLASS_SUMMARY_FIXTURE,
  EVALUATION_PAYLOAD_FIXTURE,
  MODULE_ID,
  SECOND_EVALUATION_PAYLOAD_FIXTURE,
  STUDENT_ONE_ID,
  STUDENT_TWO_ID,
  SUBSKILL_ID,
  TASK_ID,
  ZERO_SCORE_EVALUATION_PAYLOAD_FIXTURE,
} from "@/tests/samples/store/steps-creation.fixtures";
import { initializeStudentOneWithScore } from "@/tests/units/store/functions/steps-creation.store.functions";
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
      .getStudentsPresenceSelectionData() as unknown as Array<{
      title: string;
      isSelected: boolean;
      items: Array<{ name: string }>;
    }>;

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

  it("rehydrates evaluation payload with the same state semantics as StepOne->StepFour flow", () => {
    const result = useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        CLASS_SUMMARY_FIXTURE,
        EVALUATION_PAYLOAD_FIXTURE,
      );

    expect(result).toBe(true);

    const state = useEvaluationStepsCreationStore.getState();
    const studentOne = state.students.get(STUDENT_ONE_ID);
    const studentTwo = state.students.get(STUDENT_TWO_ID);

    expect(state.selectedClass?.id).toBe(CLASS_ID);
    expect(studentOne?.isPresent).toBe(true);
    expect(studentOne?.assignedTask?.id).toBe(TASK_ID);
    expect(studentOne?.overallScore).toBe(15);

    const studentOneScore = studentOne?.evaluations?.modules
      .get(MODULE_ID)
      ?.subSkills.get(SUBSKILL_ID)?.score;
    expect(studentOneScore).toBe(80);

    expect(studentTwo?.isPresent).toBe(false);
    expect(studentTwo?.assignedTask?.id).toBe(TASK_ID);

    const presentStudents = state.getAllPresentStudents();
    expect(presentStudents.map((student) => student.id)).toEqual([
      STUDENT_ONE_ID,
    ]);
  });

  it("keeps nonPresentStudentsResult in tuple format after rehydration", () => {
    useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        CLASS_SUMMARY_FIXTURE,
        EVALUATION_PAYLOAD_FIXTURE,
      );

    const values = Array.from(
      useEvaluationStepsCreationStore
        .getState()
        .nonPresentStudentsResult?.values() ?? [],
    );

    expect(values.length).toBe(1);
    expect(Array.isArray(values[0])).toBe(true);
    expect(values[0]?.[0]).toBe("Jane Doe");
    expect(values[0]?.[1]).toEqual({ id: STUDENT_TWO_ID });
    expect(values.some((value) => !Array.isArray(value))).toBe(false);
  });

  it("replaces previous same-class rehydration data without keeping old scores", () => {
    useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        CLASS_SUMMARY_FIXTURE,
        EVALUATION_PAYLOAD_FIXTURE,
      );

    useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        CLASS_SUMMARY_FIXTURE,
        SECOND_EVALUATION_PAYLOAD_FIXTURE,
      );

    const state = useEvaluationStepsCreationStore.getState();
    const studentOne = state.students.get(STUDENT_ONE_ID);
    const studentTwo = state.students.get(STUDENT_TWO_ID);

    expect(studentOne?.isPresent).toBe(false);
    expect(studentOne?.overallScore).toBeNull();
    expect(studentTwo?.isPresent).toBe(true);
    expect(studentTwo?.overallScore).toBe(50);

    const studentOneScore = studentOne?.evaluations?.modules
      .get(MODULE_ID)
      ?.subSkills.get(SUBSKILL_ID)?.score;
    const studentTwoScore = studentTwo?.evaluations?.modules
      .get(MODULE_ID)
      ?.subSkills.get(SUBSKILL_ID)?.score;

    expect(studentOneScore).toBeUndefined();
    expect(studentTwoScore).toBe(50);

    const absentValues = Array.from(
      state.nonPresentStudentsResult?.values() ?? [],
    );

    expect(absentValues).toEqual([["John Doe", { id: STUDENT_ONE_ID }]]);

    const presentScoresIds = Array.from(
      state.getAllStudentsAverageScores().entries(),
    ).map(([id]) => id);

    expect(presentScoresIds).toEqual([STUDENT_TWO_ID]);
  });

  it("keeps original score based on sliders when override changes", () => {
    const { store, module, subSkill } = initializeStudentOneWithScore(80);

    const beforeOverride = store
      .getAllStudentsAverageScores()
      .get(STUDENT_ONE_ID);

    expect(beforeOverride?.score).toBe(80);
    expect(beforeOverride?.originalScore).toBe(80);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentOverallScore(STUDENT_ONE_ID, 60);

    useEvaluationStepsCreationStore
      .getState()
      .setEvaluationForStudent(STUDENT_ONE_ID, {
        module,
        subSkill,
        score: 100,
      });

    const afterOverride = useEvaluationStepsCreationStore
      .getState()
      .getAllStudentsAverageScores()
      .get(STUDENT_ONE_ID);

    expect(afterOverride?.score).toBe(60);
    expect(afterOverride?.originalScore).toBe(100);
  });

  it("clears an override when overallScore is set to null", () => {
    const { store } = initializeStudentOneWithScore(80);

    store.setStudentOverallScore(STUDENT_ONE_ID, 60);
    expect(
      useEvaluationStepsCreationStore.getState().students.get(STUDENT_ONE_ID)
        ?.overallScore,
    ).toBe(60);

    store.setStudentOverallScore(STUDENT_ONE_ID, null);

    const studentAfterClear = useEvaluationStepsCreationStore
      .getState()
      .students.get(STUDENT_ONE_ID);
    expect(studentAfterClear?.overallScore).toBeNull();

    const averagesAfterClear = useEvaluationStepsCreationStore
      .getState()
      .getAllStudentsAverageScores()
      .get(STUDENT_ONE_ID);
    expect(averagesAfterClear?.score).toBe(80);
    expect(averagesAfterClear?.originalScore).toBe(80);
  });

  it("rehydrates payloads containing zero slider scores", () => {
    const result = useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        CLASS_SUMMARY_FIXTURE,
        ZERO_SCORE_EVALUATION_PAYLOAD_FIXTURE,
      );

    expect(result).toBe(true);

    const state = useEvaluationStepsCreationStore.getState();
    const studentOne = state.students.get(STUDENT_ONE_ID);

    expect(studentOne?.overallScore).toBe(0);

    const studentOneSubSkillScore = studentOne?.evaluations?.modules
      .get(MODULE_ID)
      ?.subSkills.get(SUBSKILL_ID)?.score;

    expect(studentOneSubSkillScore).toBe(0);

    const studentOneAverages = state
      .getAllStudentsAverageScores()
      .get(STUDENT_ONE_ID);

    expect(studentOneAverages?.score).toBe(0);
    expect(studentOneAverages?.originalScore).toBe(0);
  });
});
