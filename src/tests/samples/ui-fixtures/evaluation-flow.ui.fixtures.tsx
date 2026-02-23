import { UUID_SCHEMA, type UUID } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type { SkillsType, SkillsViewDto } from "@/api/types/routes/skills.types";
import type { StudentDto } from "@/api/types/routes/students.types";
import type { TaskTemplateDto } from "@/api/types/routes/task-templates.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import { CreateEvaluations } from "@/features/evaluations/create/CreateEvaluations";
import { StepFour } from "@/features/evaluations/create/steps/four/StepFour";
import { StepOne } from "@/features/evaluations/create/steps/one/StepOne";
import { StepThree } from "@/features/evaluations/create/steps/three/StepThree";
import { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo";
import { vi } from "vitest";
import { Navigate, type RouteObject } from "react-router-dom";

const toUuid = (value: string): UUID => UUID_SCHEMA.parse(value);

type PostMode = "success" | "error" | "slow-success";

type JsonResponseLike = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
};

export type EvaluationFlowFetchControl = {
  setPostMode: (mode: PostMode) => void;
  releaseSlowPost: () => void;
  getStats: () => {
    getCalls: number;
    postCalls: number;
    postBodies: unknown[];
  };
};

type EvaluationFlowFixture = {
  classesGrouped: Record<string, ClassSummaryDto[]>;
  classes: {
    classA: ClassSummaryDto;
    classB: ClassSummaryDto;
    classC: ClassSummaryDto;
  };
  modules: {
    shared: SkillsViewDto;
    uniqueB: SkillsViewDto;
    uniqueC: SkillsViewDto;
  };
  students: {
    classA: StudentDto[];
    classB: StudentDto[];
    classC: StudentDto[];
  };
  templates: {
    task1: TaskTemplateDto;
    task2: TaskTemplateDto;
    task3: TaskTemplateDto;
    task4: TaskTemplateDto;
  };
};

const makeSkill = (id: UUID, code: string, name: string): SkillsType => ({
  id,
  code,
  name,
});

const makeStudents = (prefix: string, base: number): StudentDto[] => {
  const names = [
    "Alice",
    "Bruno",
    "Chloé",
    "David",
    "Emma",
    "Farid",
    "Gaëlle",
    "Hugo",
    "Inès",
    "Jules",
  ];

  return names.map((firstName, index) => {
    const suffix = String(base + index).padStart(4, "0");
    const id = toUuid(`00000000-0000-4000-8000-00000000${suffix}`);

    return {
      id,
      firstName,
      lastName: `${prefix}${index + 1}`,
      email: `${firstName.toLowerCase()}.${prefix.toLowerCase()}${index + 1}@example.com`,
    };
  });
};

const sharedModuleId = toUuid("10000000-0000-4000-8000-000000000001");
const moduleBId = toUuid("10000000-0000-4000-8000-000000000002");
const moduleCId = toUuid("10000000-0000-4000-8000-000000000003");

const task1Id = toUuid("20000000-0000-4000-8000-000000000001");
const task2Id = toUuid("20000000-0000-4000-8000-000000000002");
const task3Id = toUuid("20000000-0000-4000-8000-000000000003");
const task4Id = toUuid("20000000-0000-4000-8000-000000000004");

const sharedSubSkill = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000001"),
  "SS-COMMON",
  "SubSkill commun",
);
const task1Sub1 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000002"),
  "SS-T1-A",
  "Task1 Sub A",
);
const task1Sub2 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000003"),
  "SS-T1-B",
  "Task1 Sub B",
);
const task2Sub1 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000004"),
  "SS-T2-A",
  "Task2 Sub A",
);
const task2Sub2 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000005"),
  "SS-T2-B",
  "Task2 Sub B",
);

const moduleBSub1 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000006"),
  "SS-MB-A",
  "ModuleB Sub A",
);
const moduleBSub2 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000007"),
  "SS-MB-B",
  "ModuleB Sub B",
);
const moduleBSub3 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000008"),
  "SS-MB-C",
  "ModuleB Sub C",
);

const moduleCSub1 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000009"),
  "SS-MC-A",
  "ModuleC Sub A",
);
const moduleCSub2 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000010"),
  "SS-MC-B",
  "ModuleC Sub B",
);
const moduleCSub3 = makeSkill(
  toUuid("30000000-0000-4000-8000-000000000011"),
  "SS-MC-C",
  "ModuleC Sub C",
);

const sharedModuleForTask1: SkillsViewDto = {
  id: sharedModuleId,
  code: "MOD-SHARED",
  name: "Module partagé",
  subSkills: [sharedSubSkill, task1Sub1, task1Sub2],
};

const sharedModuleForTask2: SkillsViewDto = {
  id: sharedModuleId,
  code: "MOD-SHARED",
  name: "Module partagé",
  subSkills: [sharedSubSkill, task2Sub1, task2Sub2],
};

const uniqueModuleB: SkillsViewDto = {
  id: moduleBId,
  code: "MOD-B",
  name: "Module B",
  subSkills: [moduleBSub1, moduleBSub2, moduleBSub3],
};

const uniqueModuleC: SkillsViewDto = {
  id: moduleCId,
  code: "MOD-C",
  name: "Module C",
  subSkills: [moduleCSub1, moduleCSub2, moduleCSub3],
};

const makeTemplate = (
  id: UUID,
  taskName: string,
  modules: SkillsViewDto[],
): TaskTemplateDto => ({
  id,
  taskName,
  task: {
    id,
    name: taskName,
    description: `Description ${taskName}`,
  },
  modules,
});

const templatesBase = {
  task1: makeTemplate(task1Id, "Task 1", [sharedModuleForTask1]),
  task2: makeTemplate(task2Id, "Task 2", [sharedModuleForTask2]),
  task3: makeTemplate(task3Id, "Task 3", [uniqueModuleB]),
  task4: makeTemplate(task4Id, "Task 4", [uniqueModuleC]),
};

const cloneTemplates = (): TaskTemplateDto[] => [
  structuredClone(templatesBase.task1),
  structuredClone(templatesBase.task2),
  structuredClone(templatesBase.task3),
  structuredClone(templatesBase.task4),
];

const classAStudents = makeStudents("A", 1);
const classBStudents = makeStudents("B", 101);
const classCStudents = makeStudents("C", 201);

const makeClass = (
  id: UUID,
  name: string,
  degreeLevel: string,
  students: StudentDto[],
): ClassSummaryDto => ({
  id,
  name,
  description: `Classe ${name}`,
  degreeConfigName: `${degreeLevel} - config`,
  degreeLevel,
  degreeYearCode: "2A",
  degreeYearName: "Deuxième année",
  evaluations: [],
  students,
  templates: cloneTemplates(),
});

const classA = makeClass(
  toUuid("40000000-0000-4000-8000-000000000001"),
  "Classe A",
  "CAP",
  classAStudents,
);
const classB = makeClass(
  toUuid("40000000-0000-4000-8000-000000000002"),
  "Classe B",
  "CAP",
  classBStudents,
);
const classC = makeClass(
  toUuid("40000000-0000-4000-8000-000000000003"),
  "Classe C",
  "BTS",
  classCStudents,
);

export const evaluationFlowFixture: EvaluationFlowFixture = {
  classesGrouped: {
    CAP: [classA, classB],
    BTS: [classC],
  },
  classes: {
    classA,
    classB,
    classC,
  },
  modules: {
    shared: sharedModuleForTask1,
    uniqueB: uniqueModuleB,
    uniqueC: uniqueModuleC,
  },
  students: {
    classA: classAStudents,
    classB: classBStudents,
    classC: classCStudents,
  },
  templates: {
    task1: templatesBase.task1,
    task2: templatesBase.task2,
    task3: templatesBase.task3,
    task4: templatesBase.task4,
  },
};

export function buildEvaluationCreateRoutes(): RouteObject[] {
  const tabs = EvaluationPageTabsDatas;

  return [
    {
      path: "/evaluations/create",
      element: <CreateEvaluations />,
      loader: async () => ({
        pageTitle: "Evaluation test",
        loaderData: { title: "Evaluation" },
        pageDatas: tabs,
      }),
      children: [
        {
          index: true,
          element: <Navigate to={tabs.step1.name.toLocaleLowerCase()} replace />,
        },
        { path: tabs.step1.name, element: <StepOne /> },
        { path: tabs.step2.name, element: <StepTwo /> },
        { path: tabs.step3.name, element: <StepThree /> },
        { path: tabs.step4.name, element: <StepFour /> },
      ],
    },
  ];
}

function jsonResponse(body: unknown, status = 200, statusText = "OK"): JsonResponseLike {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => body,
  };
}

export function installEvaluationFlowFetchStub(
  fixture: EvaluationFlowFixture = evaluationFlowFixture,
): EvaluationFlowFetchControl {
  let mode: PostMode = "success";
  let releaseSlowPostResolver: (() => void) | null = null;

  const stats = {
    getCalls: 0,
    postCalls: 0,
    postBodies: [] as unknown[],
  };

  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const urlStr = String(url);
      const method = String(init?.method ?? "GET").toUpperCase();

      if (method === "GET") {
        stats.getCalls += 1;

        if (urlStr.includes(API_ENDPOINTS.GET.CLASSES.endPoints.ALL)) {
          return jsonResponse({ data: fixture.classesGrouped }, 200);
        }

        return jsonResponse({ data: [] }, 200);
      }

      if (method === "POST") {
        stats.postCalls += 1;

        const rawBody = init?.body;
        if (typeof rawBody === "string") {
          try {
            stats.postBodies.push(JSON.parse(rawBody));
          } catch {
            stats.postBodies.push(rawBody);
          }
        } else {
          stats.postBodies.push(rawBody ?? null);
        }

        if (!urlStr.includes(API_ENDPOINTS.POST.CREATE_EVALUATION.endpoint)) {
          return jsonResponse({ data: {} }, 200);
        }

        if (mode === "error") {
          return jsonResponse(
            {
              error: "Internal Server Error",
              message: "Simulated evaluation submit failure",
            },
            500,
            "Internal Server Error",
          );
        }

        if (mode === "slow-success") {
          await new Promise<void>((resolve) => {
            releaseSlowPostResolver = resolve;
          });
        }

        return jsonResponse(
          {
            success: "Evaluation saved",
            data: {
              id: toUuid("50000000-0000-4000-8000-000000000001"),
              classId: fixture.classes.classA.id,
              name: "Evaluation de test",
            },
          },
          200,
        );
      }

      return jsonResponse({ data: [] }, 200);
    }),
  );

  return {
    setPostMode(nextMode: PostMode) {
      mode = nextMode;
    },
    releaseSlowPost() {
      if (releaseSlowPostResolver) {
        releaseSlowPostResolver();
        releaseSlowPostResolver = null;
      }
    },
    getStats() {
      return {
        getCalls: stats.getCalls,
        postCalls: stats.postCalls,
        postBodies: [...stats.postBodies],
      };
    },
  };
}
