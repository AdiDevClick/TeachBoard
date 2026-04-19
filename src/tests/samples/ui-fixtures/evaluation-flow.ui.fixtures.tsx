import type { UUID } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type {
  SkillsType,
  SkillsViewDto,
} from "@/api/types/routes/skills.types";
import type { StudentDto } from "@/api/types/routes/students.types";
import type { TaskTemplateDto } from "@/api/types/routes/task-templates.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import { CreateEvaluations } from "@/features/evaluations/create/CreateEvaluations";
import { StepFour } from "@/features/evaluations/create/steps/four/StepFour";
import { StepOne } from "@/features/evaluations/create/steps/one/StepOne";
import { StepThree } from "@/features/evaluations/create/steps/three/StepThree";
import { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo";
import { EvaluationFlowFixtureCreator } from "@/utils/FixtureCreator";
import { Navigate, type RouteObject } from "react-router-dom";
import { vi } from "vitest";

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

const fixtureBuilder = new EvaluationFlowFixtureCreator();

const makeStudents = (prefix: string): StudentDto[] => {
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
    const lastName = `${prefix}${index + 1}`;

    return fixtureBuilder.createStudentDto(
      fixtureBuilder.generateUUID(),
      firstName,
      lastName,
      `${firstName} ${lastName}`,
    );
  });
};

const makeSkill = (code: string, name: string): SkillsType =>
  fixtureBuilder.createSkillType(fixtureBuilder.generateUUID(), code, name);

const makeModule = (
  code: string,
  name: string,
  subSkills: SkillsType[],
  id?: UUID,
): SkillsViewDto =>
  fixtureBuilder.createSkillsView(
    id ?? fixtureBuilder.generateUUID(),
    code,
    name,
    subSkills,
  );

const sharedSubSkill = makeSkill("SS-COMMON", "SubSkill commun");
const sharedModuleId = fixtureBuilder.generateUUID();

const sharedModuleForTask1 = makeModule(
  "MOD-SHARED",
  "Module partagé",
  [
    sharedSubSkill,
    makeSkill("SS-T1-A", "Task1 Sub A"),
    makeSkill("SS-T1-B", "Task1 Sub B"),
  ],
  sharedModuleId,
);

const sharedModuleForTask2 = makeModule(
  "MOD-SHARED",
  "Module partagé",
  [
    sharedSubSkill,
    makeSkill("SS-T2-A", "Task2 Sub A"),
    makeSkill("SS-T2-B", "Task2 Sub B"),
  ],
  sharedModuleId,
);

const uniqueModuleB = makeModule("MOD-B", "Module B", [
  makeSkill("SS-MB-A", "ModuleB Sub A"),
  makeSkill("SS-MB-B", "ModuleB Sub B"),
  makeSkill("SS-MB-C", "ModuleB Sub C"),
]);

const uniqueModuleC = makeModule("MOD-C", "Module C", [
  makeSkill("SS-MC-A", "ModuleC Sub A"),
  makeSkill("SS-MC-B", "ModuleC Sub B"),
  makeSkill("SS-MC-C", "ModuleC Sub C"),
]);

const makeTemplate = (
  taskName: string,
  modules: SkillsViewDto[],
): TaskTemplateDto =>
  fixtureBuilder.createTaskTemplateWithModules({
    id: fixtureBuilder.generateUUID(),
    taskName,
    modules,
    description: `Description ${taskName}`,
  });

const templatesBase = {
  task1: makeTemplate("Task 1", [sharedModuleForTask1]),
  task2: makeTemplate("Task 2", [sharedModuleForTask2]),
  task3: makeTemplate("Task 3", [uniqueModuleB]),
  task4: makeTemplate("Task 4", [uniqueModuleC]),
};

const cloneTemplates = (): TaskTemplateDto[] => [
  structuredClone(templatesBase.task1),
  structuredClone(templatesBase.task2),
  structuredClone(templatesBase.task3),
  structuredClone(templatesBase.task4),
];

const classAStudents = makeStudents("A");
const classBStudents = makeStudents("B");
const classCStudents = makeStudents("C");

const makeClass = (
  name: string,
  degreeLevel: string,
  students: StudentDto[],
): ClassSummaryDto =>
  fixtureBuilder.createClassSummary(
    fixtureBuilder.generateUUID(),
    students,
    cloneTemplates(),
    {
      name,
      description: `Classe ${name}`,
      degreeConfigName: `${degreeLevel} - config`,
      degreeLevel,
      degreeYearCode: "2A",
      degreeYearName: "Deuxième année",
    },
  );

const classA = makeClass("Classe A", "CAP", classAStudents);
const classB = makeClass("Classe B", "CAP", classBStudents);
const classC = makeClass("Classe C", "BTS", classCStudents);

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
  const step1Path = tabs.step1.name.toLocaleLowerCase();
  const step2Path = tabs.step2.name.toLocaleLowerCase();
  const step3Path = tabs.step3.name.toLocaleLowerCase();
  const step4Path = tabs.step4.name.toLocaleLowerCase();

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
          element: <Navigate to={step1Path} replace />,
        },
        { path: step1Path, element: <StepOne /> },
        { path: step2Path, element: <StepTwo /> },
        { path: step3Path, element: <StepThree /> },
        {
          path: step4Path,
          element: <StepFour />,
          loader: async () => ({ mode: "create" as const }),
        },
      ],
    },
  ];
}

function jsonResponse(
  body: unknown,
  status = 200,
  statusText = "OK",
): JsonResponseLike {
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

  const pushPostBody = (rawBody: RequestInit["body"]) => {
    if (typeof rawBody === "string") {
      try {
        stats.postBodies.push(JSON.parse(rawBody));
      } catch {
        stats.postBodies.push(rawBody);
      }

      return;
    }

    stats.postBodies.push(rawBody ?? null);
  };

  const handleGetRequest = (urlStr: string): JsonResponseLike => {
    stats.getCalls += 1;

    if (urlStr.includes(API_ENDPOINTS.GET.CLASSES.endPoints.ALL)) {
      return jsonResponse({ data: fixture.classesGrouped }, 200);
    }

    return jsonResponse({ data: [] }, 200);
  };

  const handlePostRequest = async (
    urlStr: string,
    init?: RequestInit,
  ): Promise<JsonResponseLike> => {
    stats.postCalls += 1;
    pushPostBody(init?.body);

    if (!urlStr.includes(API_ENDPOINTS.POST.CREATE_EVALUATION.endpoint)) {
      return jsonResponse({ data: {} }, 200);
    }

    if (mode === "error") {
      return jsonResponse(
        {
          error: "Bad Request",
          message: "Simulated evaluation submit failure",
        },
        400,
        "Bad Request",
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
          id: fixtureBuilder.generateUUID(),
          classId: fixture.classes.classA.id,
          name: "Evaluation de test",
        },
      },
      200,
    );
  };

  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const urlStr = String(url);
      const method = String(init?.method ?? "GET").toUpperCase();

      if (method === "GET") {
        return handleGetRequest(urlStr);
      }

      if (method === "POST") {
        return handlePostRequest(urlStr, init);
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
