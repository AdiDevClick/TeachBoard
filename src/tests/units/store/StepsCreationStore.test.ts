import {
  DEFAULT_VALUES_STEPS_CREATION_STATE,
  useEvaluationStepsCreationStore,
} from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { beforeEach, describe, expect, it } from "vitest";

const CLASS_ID = "11111111-1111-4111-8111-111111111111";
const STUDENT_ONE_ID = "22222222-2222-4222-8222-222222222222";
const STUDENT_TWO_ID = "33333333-3333-4333-8333-333333333333";
const TASK_ID = "44444444-4444-4444-8444-444444444444";
const MODULE_ID = "55555555-5555-4555-8555-555555555555";
const SUBSKILL_ID = "66666666-6666-4666-8666-666666666666";
const EVALUATION_ID = "77777777-7777-4777-8777-777777777777";
const USER_ID = "88888888-8888-4888-8888-888888888888";

const CLASS_SUMMARY_FIXTURE = {
  id: CLASS_ID,
  name: "BTS SIO",
  degreeLevel: "BTS",
  degreeYearCode: "S1",
  degreeYearName: "Semestre 1",
  evaluations: [],
  students: [
    {
      id: STUDENT_ONE_ID,
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
    },
    {
      id: STUDENT_TWO_ID,
      firstName: "Jane",
      lastName: "Doe",
      fullName: "Jane Doe",
    },
  ],
  templates: [
    {
      id: TASK_ID,
      taskName: "TP 1",
      task: {
        id: TASK_ID,
        name: "TP 1",
        description: "Exercice",
      },
      modules: [
        {
          id: MODULE_ID,
          code: "M1",
          name: "Module 1",
          subSkills: [
            {
              id: SUBSKILL_ID,
              code: "S1",
              name: "SubSkill 1",
            },
          ],
        },
      ],
    },
  ],
};

const EVALUATION_PAYLOAD_FIXTURE: DetailedEvaluationView = {
  id: EVALUATION_ID,
  title: "Evaluation reconstruite",
  className: "BTS SIO",
  classId: CLASS_ID,
  evaluationDate: "2026-03-31T00:00:00.000Z",
  userId: USER_ID,
  absentStudents: [{ id: STUDENT_TWO_ID, name: "Jane Doe" }],
  attendedModules: [
    {
      id: MODULE_ID,
      code: "M1",
      name: "Module 1",
      subSkills: [
        {
          id: SUBSKILL_ID,
          code: "S1",
          name: "SubSkill 1",
          isDisabled: false,
        },
      ],
    },
  ],
  evaluations: [
    {
      id: STUDENT_ONE_ID,
      name: "John Doe",
      isPresent: true,
      overallScore: 15,
      assignedTask: {
        id: TASK_ID,
        name: "TP 1",
      },
      modules: [
        {
          id: MODULE_ID,
          subSkills: [
            {
              id: SUBSKILL_ID,
              score: 80,
            },
          ],
        },
      ],
    },
    {
      id: STUDENT_TWO_ID,
      name: "Jane Doe",
      isPresent: false,
      overallScore: null,
      assignedTask: {
        id: TASK_ID,
        name: "TP 1",
      },
      modules: [],
    },
  ],
};

const SECOND_EVALUATION_PAYLOAD_FIXTURE: DetailedEvaluationView = {
  id: "99999999-9999-4999-8999-999999999999",
  title: "Evaluation rechargée",
  className: "BTS SIO",
  classId: CLASS_ID,
  evaluationDate: "2026-04-01T00:00:00.000Z",
  userId: USER_ID,
  absentStudents: [{ id: STUDENT_ONE_ID, name: "John Doe" }],
  attendedModules: [
    {
      id: MODULE_ID,
      code: "M1",
      name: "Module 1",
      subSkills: [
        {
          id: SUBSKILL_ID,
          code: "S1",
          name: "SubSkill 1",
          isDisabled: false,
        },
      ],
    },
  ],
  evaluations: [
    {
      id: STUDENT_ONE_ID,
      name: "John Doe",
      isPresent: false,
      overallScore: null,
      assignedTask: {
        id: TASK_ID,
        name: "TP 1",
      },
      modules: [],
    },
    {
      id: STUDENT_TWO_ID,
      name: "Jane Doe",
      isPresent: true,
      overallScore: 50,
      assignedTask: {
        id: TASK_ID,
        name: "TP 1",
      },
      modules: [
        {
          id: MODULE_ID,
          subSkills: [
            {
              id: SUBSKILL_ID,
              score: 50,
            },
          ],
        },
      ],
    },
  ],
};

const ZERO_SCORE_EVALUATION_PAYLOAD_FIXTURE: DetailedEvaluationView = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  title: "Evaluation avec score zéro",
  className: "BTS SIO",
  classId: CLASS_ID,
  evaluationDate: "2026-04-02T00:00:00.000Z",
  userId: USER_ID,
  absentStudents: [],
  attendedModules: [
    {
      id: MODULE_ID,
      code: "M1",
      name: "Module 1",
      subSkills: [
        {
          id: SUBSKILL_ID,
          code: "S1",
          name: "SubSkill 1",
          isDisabled: false,
        },
      ],
    },
  ],
  evaluations: [
    {
      id: STUDENT_ONE_ID,
      name: "John Doe",
      isPresent: true,
      overallScore: 0,
      assignedTask: {
        id: TASK_ID,
        name: "TP 1",
      },
      modules: [
        {
          id: MODULE_ID,
          subSkills: [
            {
              id: SUBSKILL_ID,
              score: 0,
            },
          ],
        },
      ],
    },
    {
      id: STUDENT_TWO_ID,
      name: "Jane Doe",
      isPresent: true,
      overallScore: null,
      assignedTask: {
        id: TASK_ID,
        name: "TP 1",
      },
      modules: [
        {
          id: MODULE_ID,
          subSkills: [
            {
              id: SUBSKILL_ID,
              score: 25,
            },
          ],
        },
      ],
    },
  ],
};

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
    const store = useEvaluationStepsCreationStore.getState();

    store.setSelectedClass(CLASS_SUMMARY_FIXTURE);
    store.setStudentPresence(STUDENT_ONE_ID, true);
    store.setStudentTaskAssignment(TASK_ID, STUDENT_ONE_ID);

    const module = store.getSelectedModule(MODULE_ID);
    const subSkill = module?.subSkills.get(SUBSKILL_ID);

    if (!module || !subSkill) {
      throw new Error("Fixture module/sub-skill not found in test state");
    }

    store.setEvaluationForStudent(STUDENT_ONE_ID, {
      module,
      subSkill,
      score: 80,
    });

    const beforeOverride = useEvaluationStepsCreationStore
      .getState()
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
