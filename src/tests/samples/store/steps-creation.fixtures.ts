import { UUID_SCHEMA } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { EvaluationFlowFixtureCreator } from "@/utils/FixtureCreator.ts";

export const CLASS_ID = UUID_SCHEMA.parse(
  "11111111-1111-4111-8111-111111111111",
);
export const STUDENT_ONE_ID = UUID_SCHEMA.parse(
  "22222222-2222-4222-8222-222222222222",
);
export const STUDENT_TWO_ID = UUID_SCHEMA.parse(
  "33333333-3333-4333-8333-333333333333",
);
export const TASK_ID = UUID_SCHEMA.parse(
  "44444444-4444-4444-8444-444444444444",
);
export const MODULE_ID = UUID_SCHEMA.parse(
  "55555555-5555-4555-8555-555555555555",
);
export const SUBSKILL_ID = UUID_SCHEMA.parse(
  "66666666-6666-4666-8666-666666666666",
);
export const EVALUATION_ID = UUID_SCHEMA.parse(
  "77777777-7777-4777-8777-777777777777",
);
export const USER_ID = UUID_SCHEMA.parse(
  "88888888-8888-4888-8888-888888888888",
);
export const SECOND_EVALUATION_ID = UUID_SCHEMA.parse(
  "99999999-9999-4999-8999-999999999999",
);
export const ZERO_SCORE_EVALUATION_ID = UUID_SCHEMA.parse(
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
);

const fixtureBuilder = new EvaluationFlowFixtureCreator({
  classId: CLASS_ID,
  userId: USER_ID,
  className: "BTS SIO",
  evaluationDate: "2026-03-31T00:00:00.000Z",
});

export const CLASS_SUMMARY_FIXTURE: ClassSummaryDto =
  fixtureBuilder.createClassSummary(
    CLASS_ID,
    [
      fixtureBuilder.createStudentDto(
        STUDENT_ONE_ID,
        "John",
        "Doe",
        "John Doe",
      ),
      fixtureBuilder.createStudentDto(
        STUDENT_TWO_ID,
        "Jane",
        "Doe",
        "Jane Doe",
      ),
    ],
    [fixtureBuilder.createTaskTemplate(TASK_ID, MODULE_ID, SUBSKILL_ID)],
  );

export const EVALUATION_PAYLOAD_FIXTURE: DetailedEvaluationView =
  fixtureBuilder.createDetailedEvaluationView(
    EVALUATION_ID,
    "Evaluation reconstruite",
    [{ id: STUDENT_TWO_ID, name: "Jane Doe" }],
    [
      fixtureBuilder.createEvaluationStudent(
        STUDENT_ONE_ID,
        "John Doe",
        true,
        15,
        [
          fixtureBuilder.createEvaluationModule(MODULE_ID, [
            fixtureBuilder.createEvaluationSubSkill(SUBSKILL_ID, 80),
          ]),
        ],
        TASK_ID,
      ),
      fixtureBuilder.createEvaluationStudent(
        STUDENT_TWO_ID,
        "Jane Doe",
        false,
        null,
        [],
        TASK_ID,
      ),
    ],
    [fixtureBuilder.createAttendedModule(MODULE_ID, SUBSKILL_ID)],
  );

export const SECOND_EVALUATION_PAYLOAD_FIXTURE: DetailedEvaluationView =
  fixtureBuilder.createDetailedEvaluationView(
    SECOND_EVALUATION_ID,
    "Evaluation rechargée",
    [{ id: STUDENT_ONE_ID, name: "John Doe" }],
    [
      fixtureBuilder.createEvaluationStudent(
        STUDENT_ONE_ID,
        "John Doe",
        false,
        null,
        [],
        TASK_ID,
      ),
      fixtureBuilder.createEvaluationStudent(
        STUDENT_TWO_ID,
        "Jane Doe",
        true,
        50,
        [
          fixtureBuilder.createEvaluationModule(MODULE_ID, [
            fixtureBuilder.createEvaluationSubSkill(SUBSKILL_ID, 50),
          ]),
        ],
        TASK_ID,
      ),
    ],
    [fixtureBuilder.createAttendedModule(MODULE_ID, SUBSKILL_ID)],
  );

export const ZERO_SCORE_EVALUATION_PAYLOAD_FIXTURE: DetailedEvaluationView =
  fixtureBuilder.createDetailedEvaluationView(
    ZERO_SCORE_EVALUATION_ID,
    "Evaluation avec score zéro",
    [],
    [
      fixtureBuilder.createEvaluationStudent(
        STUDENT_ONE_ID,
        "John Doe",
        true,
        0,
        [
          fixtureBuilder.createEvaluationModule(MODULE_ID, [
            fixtureBuilder.createEvaluationSubSkill(SUBSKILL_ID, 0),
          ]),
        ],
        TASK_ID,
      ),
      fixtureBuilder.createEvaluationStudent(
        STUDENT_TWO_ID,
        "Jane Doe",
        true,
        null,
        [
          fixtureBuilder.createEvaluationModule(MODULE_ID, [
            fixtureBuilder.createEvaluationSubSkill(SUBSKILL_ID, 25),
          ]),
        ],
        TASK_ID,
      ),
    ],
    [fixtureBuilder.createAttendedModule(MODULE_ID, SUBSKILL_ID)],
  );
