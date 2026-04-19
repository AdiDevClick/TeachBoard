import { UUID_SCHEMA, type UUID } from "@/api/types/openapi/common.types";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { EvaluationFlowFixtureCreator } from "@/utils/FixtureCreator";

const toUuid = (value: string): UUID => UUID_SCHEMA.parse(value);

const CLASS_ID = toUuid("1f1022ee-3d9b-6efc-b662-d77014b42f3f");
const USER_ID = toUuid("1f0de94e-a442-6895-bb6a-6baf81233df8");

const TASK_ABATTAGE_ID = toUuid("1f0f2f15-14af-650c-a64a-2b3a294c2134");
const TASK_TRONCONNEUSE_ID = toUuid("1f0f2f1a-440c-600d-a64a-2b3a294c2134");

const TASK_ABATTAGE_NAME = "Opérations dabattage et préparation des grumes";
const TASK_TRONCONNEUSE_NAME =
  "Conduite de tronçonneuse maintenance de premier niveau";

const fixtureBuilder = new EvaluationFlowFixtureCreator({
  classId: CLASS_ID,
  userId: USER_ID,
  className: "bucheron - test",
});

type EvaluationStudent = DetailedEvaluationView["evaluations"][number];
type EvaluationModule = EvaluationStudent["modules"][number];
type AttendedModule = NonNullable<
  DetailedEvaluationView["attendedModules"]
>[number];
type AttendedSubSkill = AttendedModule["subSkills"][number];

function attendedSubSkill(
  id: string,
  code: string,
  name: string,
): AttendedSubSkill {
  return fixtureBuilder.createAttendedSubSkill(toUuid(id), code, name, false);
}

function attendedModule(
  id: string,
  code: string,
  name: string,
  subSkills: AttendedSubSkill[],
): AttendedModule {
  const firstSubSkill = subSkills[0];

  if (!firstSubSkill) {
    throw new Error(
      "[evaluations-payload] attended module requires one sub-skill",
    );
  }

  return fixtureBuilder.createAttendedModule(toUuid(id), firstSubSkill.id, {
    code,
    name,
    subSkills,
  });
}

function scoredModule(
  id: string,
  subSkills: Array<{ id: string; score: number }>,
): EvaluationModule {
  return fixtureBuilder.createEvaluationModule(
    toUuid(id),
    subSkills.map((subSkill) =>
      fixtureBuilder.createEvaluationSubSkill(
        toUuid(subSkill.id),
        subSkill.score,
      ),
    ),
  );
}

function evaluatedStudent(params: {
  id: string;
  name: string;
  isPresent: boolean;
  overallScore: number | null;
  assignedTaskId: UUID;
  assignedTaskName: string;
  modules: EvaluationModule[];
}): EvaluationStudent {
  return fixtureBuilder.createEvaluationStudent(
    toUuid(params.id),
    params.name,
    params.isPresent,
    params.overallScore,
    params.modules,
    params.assignedTaskId,
    params.assignedTaskName,
  );
}

const ABSENT_STUDENTS = [
  { id: toUuid("1f0de94c-920c-67ab-a03b-131f02028328"), name: "Trov Roa" },
  { id: toUuid("1f0de94c-c689-6fb0-a03b-131f02028328"), name: "Jean Trops" },
  { id: toUuid("1f0de94c-cbba-61b1-a03b-131f02028328"), name: "José Sciq" },
  {
    id: toUuid("1f0de94c-412d-6579-a03b-131f02028328"),
    name: "Eloise Cartoon",
  },
  {
    id: toUuid("1f0de94c-9763-6aaf-a03b-131f02028328"),
    name: "Richard Triz",
  },
];

const FIRST_ATTENDED_MODULES = [
  attendedModule(
    "1f0f2e76-9398-6efc-a64a-2b3a294c2134",
    "ABT",
    "abattage et choix darbre",
    [
      attendedSubSkill(
        "1f0f2e6b-ef99-62e6-a64a-2b3a294c2134",
        "TEC",
        "technique dabattage directionnel",
      ),
      attendedSubSkill(
        "1f0f2e6b-80d1-6ce5-a64a-2b3a294c2134",
        "ESS",
        "sélection des essences",
      ),
      attendedSubSkill(
        "1f0f2e6b-0a90-65e4-a64a-2b3a294c2134",
        "EVR",
        "évaluation des risques",
      ),
    ],
  ),
  attendedModule(
    "1f0f2e79-9f52-64ff-a64a-2b3a294c2134",
    "SFT",
    "sécurité et secourisme",
    [
      attendedSubSkill(
        "1f0f2e6f-4fdb-62ed-a64a-2b3a294c2134",
        "EPI",
        "équipements de protection",
      ),
    ],
  ),
];

const SECOND_ATTENDED_MODULES = [
  ...FIRST_ATTENDED_MODULES,
  attendedModule(
    "1f0f2e77-90bd-69fd-a64a-2b3a294c2134",
    "TRS",
    "conduite de tronçonneuse",
    [
      attendedSubSkill(
        "1f0f2e6c-c7a9-6ae8-a64a-2b3a294c2134",
        "COU",
        "technique de coupe et guidage",
      ),
      attendedSubSkill(
        "1f0f2e6d-6b15-69e9-a64a-2b3a294c2134",
        "ENT",
        "entretien quotidien chaîne et filtre",
      ),
      attendedSubSkill(
        "1f0f2e6c-6c43-63e7-a64a-2b3a294c2134",
        "DMS",
        "démarrage et arrêt sûrs",
      ),
    ],
  ),
  attendedModule(
    "1f0f2e7b-915e-6501-a64a-2b3a294c2134",
    "OUT",
    "entretien et outillage",
    [
      attendedSubSkill(
        "1f0f2e71-c436-68f3-a64a-2b3a294c2134",
        "AFF",
        "affûtage des chaînes",
      ),
    ],
  ),
];

export const firsteval: DetailedEvaluationView =
  fixtureBuilder.createDetailedEvaluationView(
    toUuid("1f110210-2a47-6315-b529-4bb63878560d"),
    "Evaluation du 22 février 2026 (1)",
    ABSENT_STUDENTS,
    [
      evaluatedStudent({
        id: "1f0de94c-8785-62a3-a03b-131f02028328",
        name: "Raz Fitz",
        isPresent: true,
        overallScore: 13,
        assignedTaskId: TASK_ABATTAGE_ID,
        assignedTaskName: TASK_ABATTAGE_NAME,
        modules: [
          scoredModule("1f0f2e79-9f52-64ff-a64a-2b3a294c2134", [
            { id: "1f0f2e6f-4fdb-62ed-a64a-2b3a294c2134", score: 50 },
          ]),
          scoredModule("1f0f2e76-9398-6efc-a64a-2b3a294c2134", [
            { id: "1f0f2e6b-ef99-62e6-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6b-80d1-6ce5-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6b-0a90-65e4-a64a-2b3a294c2134", score: 50 },
          ]),
        ],
      }),
      evaluatedStudent({
        id: "1f0de94c-8d03-66a7-a03b-131f02028328",
        name: "Goul Anemo",
        isPresent: true,
        overallScore: 15,
        assignedTaskId: TASK_ABATTAGE_ID,
        assignedTaskName: TASK_ABATTAGE_NAME,
        modules: [
          scoredModule("1f0f2e79-9f52-64ff-a64a-2b3a294c2134", [
            { id: "1f0f2e6f-4fdb-62ed-a64a-2b3a294c2134", score: 75 },
          ]),
          scoredModule("1f0f2e76-9398-6efc-a64a-2b3a294c2134", [
            { id: "1f0f2e6b-ef99-62e6-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6b-80d1-6ce5-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6b-0a90-65e4-a64a-2b3a294c2134", score: 75 },
          ]),
        ],
      }),
    ],
    FIRST_ATTENDED_MODULES,
    {
      evaluationDate: "2026-02-22T19:02:12.708Z",
      comments: "dqsdqs",
    },
  );

export const secondeval: DetailedEvaluationView =
  fixtureBuilder.createDetailedEvaluationView(
    toUuid("1f119889-fa58-627a-94c1-03cd09b771c2"),
    "Evaluation du 6 mars 2026 (6)",
    ABSENT_STUDENTS,
    [
      evaluatedStudent({
        id: "1f0de94c-8785-62a3-a03b-131f02028328",
        name: "Raz Fitz",
        isPresent: true,
        overallScore: 15,
        assignedTaskId: TASK_ABATTAGE_ID,
        assignedTaskName: TASK_ABATTAGE_NAME,
        modules: [
          scoredModule("1f0f2e79-9f52-64ff-a64a-2b3a294c2134", [
            { id: "1f0f2e6f-4fdb-62ed-a64a-2b3a294c2134", score: 75 },
          ]),
          scoredModule("1f0f2e76-9398-6efc-a64a-2b3a294c2134", [
            { id: "1f0f2e6b-ef99-62e6-a64a-2b3a294c2134", score: 50 },
            { id: "1f0f2e6b-80d1-6ce5-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6b-0a90-65e4-a64a-2b3a294c2134", score: 100 },
          ]),
        ],
      }),
      evaluatedStudent({
        id: "1f0de94c-8d03-66a7-a03b-131f02028328",
        name: "Goul Anemo",
        isPresent: true,
        overallScore: 15,
        assignedTaskId: TASK_TRONCONNEUSE_ID,
        assignedTaskName: TASK_TRONCONNEUSE_NAME,
        modules: [
          scoredModule("1f0f2e77-90bd-69fd-a64a-2b3a294c2134", [
            { id: "1f0f2e6c-c7a9-6ae8-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6d-6b15-69e9-a64a-2b3a294c2134", score: 75 },
            { id: "1f0f2e6c-6c43-63e7-a64a-2b3a294c2134", score: 75 },
          ]),
          scoredModule("1f0f2e7b-915e-6501-a64a-2b3a294c2134", [
            { id: "1f0f2e71-c436-68f3-a64a-2b3a294c2134", score: 75 },
          ]),
        ],
      }),
    ],
    SECOND_ATTENDED_MODULES,
    {
      evaluationDate: "2026-03-06T18:15:33.348Z",
      comments: "test",
    },
  );
