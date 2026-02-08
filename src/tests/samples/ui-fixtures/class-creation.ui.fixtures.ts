import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { degreeModuleCreationInputControllers } from "@/features/class-creation/components/DegreeModule/forms/degree-module-inputs";
import { diplomaCreationInputControllers } from "@/features/class-creation/components/DiplomaCreation/forms/diploma-creation-inputs";
import { taskTemplateCreationInputControllers } from "@/features/class-creation/components/TaskTemplateCreation/forms/task-template-inputs";
import { classCreationInputControllers } from "@/features/class-creation/index.ts";
import { stepOneInputControllers } from "@/features/evaluations/create/steps/one/forms/step-one-inputs.ts";
import {
  classCreated,
  classFetched,
  classFetched2,
  degreeCreatedResponse,
  degreeFieldFetched,
  degreeFieldFetched2,
  degreeLevelFetched,
  degreeLevelFetched2,
  degreeYearFetched,
  degreeYearFetched2,
  diplomaCreated,
  diplomaFetched,
  diplomaFetched2,
  skillsModulesFetched,
  studentFetched,
  taskCreated,
  taskFetched,
  taskFetched2,
  taskFetched3,
  taskFetched4,
  taskTemplateCreated,
  taskTemplateFetch,
} from "@/tests/samples/class-creation-sample-datas";
import { stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/types/AppInputControllerInterface";

type ControllerLike = {
  name?: string;
  label?: string;
  title?: string;
  task?: unknown;
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: DataReshapeFn;
  creationButtonText?: unknown;
};

type ControllersConfig<T extends ControllerLike> = {
  controllerName: readonly T[];
  outputNames: Record<string, string>;
};

type InstallFetchStubs = (_postResponse?: unknown) => void;

type StubRouteCtx = {
  controllers: Record<string, ControllerLike>;
  sample: typeof sample;
  post?: { endpoint: string; dataReshapeFn?: unknown };
  postResponse?: unknown;
  vars?: Record<string, unknown>;
};

type StubControllerUrlSpec = {
  controller: ControllerLike;
  mode?: "exact" | "prefix";
};

type StubUrlSpec =
  | string
  | StubControllerUrlSpec
  | ((_ctx: StubRouteCtx) => string);

type StubResponseValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined;

type StubResponseSpec = StubResponseValue | ((_ctx: StubRouteCtx) => unknown);

type StubRouteSpec = {
  url: StubUrlSpec;
  response: StubResponseSpec;
};

type StubRoutesSpec = {
  getRoutes?: readonly StubRouteSpec[];
  postRoutes?: readonly StubRouteSpec[];
};

function buildFetchStubs(
  spec: StubRoutesSpec,
  ctx: StubRouteCtx,
): {
  getRoutes: Array<[string, unknown]>;
  postRoutes: Array<[string, unknown]>;
} {
  const dynamicEndpointPrefix = (
    endpointFn: (_arg: string) => string,
    placeholder = "__DYNAMIC_ARG__",
  ): string => endpointFn(placeholder).replace(placeholder, "");

  const resolveUrl = (url: StubUrlSpec): string => {
    if (typeof url === "string") return url;
    if (typeof url === "function") return url(ctx);

    const controller = url.controller;

    const apiEndpoint = controller.apiEndpoint;
    if (typeof apiEndpoint === "function") {
      if (url.mode === "prefix") return dynamicEndpointPrefix(apiEndpoint);
      throw new Error(
        "[useAppFixtures] controller apiEndpoint is dynamic for stub",
      );
    }

    return String(apiEndpoint);
  };

  const resolveResponse = (response: StubResponseSpec): unknown =>
    typeof response === "function" ? response(ctx) : response;

  const getRoutes = (spec.getRoutes ?? []).map((r): [string, unknown] => [
    resolveUrl(r.url),
    resolveResponse(r.response),
  ]);

  const postRoutes = (spec.postRoutes ?? []).map((r): [string, unknown] => [
    resolveUrl(r.url),
    resolveResponse(r.response),
  ]);

  return { getRoutes, postRoutes };
}

const sample = {
  classCreated,
  classFetched,
  classFetched2,
  degreeCreatedResponse,
  degreeFieldFetched,
  degreeFieldFetched2,
  degreeLevelFetched,
  degreeLevelFetched2,
  degreeYearFetched,
  degreeYearFetched2,
  diplomaCreated,
  diplomaFetched,
  diplomaFetched2,
  skillsModulesFetched,
  studentFetched,
  taskCreated,
  taskFetched,
  taskFetched2,
  taskFetched3,
  taskFetched4,
  taskTemplateCreated,
  taskTemplateFetch,
};

const POSTEndpoints = {
  CREATE_DEGREE: {
    endpoints: API_ENDPOINTS.POST.CREATE_DEGREE.endpoints,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape,
  },
  CREATE_DIPLOMA: {
    endpoint: API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape,
  },
  CREATE_TASK: {
    endpoint: API_ENDPOINTS.POST.CREATE_TASK.endpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_TASK.dataReshape,
  },
  CREATE_TASK_TEMPLATE: {
    endpoint: API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape,
  },
  CREATE_CLASS: {
    endpoint: API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_CLASS.dataReshape,
  },
  CREATE_SKILL_MODULE: {
    endpoint: API_ENDPOINTS.POST.CREATE_SKILL.endPoints.MODULE,
  },
  CREATE_SKILL_SUBSKILL: {
    endpoint: API_ENDPOINTS.POST.CREATE_SKILL.endPoints.SUBSKILL,
  },
} as const;

// Extra lightweight controllers for GET-only endpoints so the fixture system
// can derive URLs directly from controllers instead of a separate GET map.
const extraInputControllers: ControllerLike[] = [
  {
    name: "taskTemplatesAll",
    apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.ALL,
  },
];

const controllersConfig: Array<ControllersConfig<ControllerLike>> = [
  {
    controllerName: diplomaCreationInputControllers,
    outputNames: {
      diplomaFieldController: "diplomaFieldId",
      diplomaYearController: "yearId",
      diplomaLevelController: "levelId",
      diplomaModuleController: "modulesList",
    },
  },
  {
    controllerName: stepOneInputControllers,
    outputNames: { classesController: "classe" },
  },
  {
    controllerName: classCreationInputControllers,
    outputNames: {
      diplomasController: "degreeConfigId",
      studentsController: "students",
      templatesControllerBase: "tasks",
    },
  },
  {
    controllerName: taskTemplateCreationInputControllers,
    outputNames: { taskLabelController: "taskId", skillsController: "modules" },
  },
  {
    controllerName: degreeModuleCreationInputControllers,
    outputNames: { skillListController: "skillList" },
  },
  {
    controllerName: extraInputControllers,
    outputNames: { taskTemplatesAllController: "taskTemplatesAll" },
  },
];

const routes = (
  controllers: Record<string, ControllerLike>,
): Record<string, StubRoutesSpec> =>
  ({
    createDiploma: {
      getRoutes: [
        {
          url: { controller: controllers.diplomasController },
          response: ({ sample }: StubRouteCtx) => ({
            [sample.diplomaFetched.degreeField]: [
              sample.diplomaFetched,
              sample.diplomaFetched2,
            ],
          }),
        },
        {
          url: { controller: controllers.diplomaFieldController },
          response: ({ sample }: StubRouteCtx) => [
            sample.degreeFieldFetched,
            sample.degreeFieldFetched2,
          ],
        },
        {
          url: { controller: controllers.diplomaYearController },
          response: ({ sample }: StubRouteCtx) => [
            sample.degreeYearFetched,
            sample.degreeYearFetched2,
          ],
        },
        {
          url: { controller: controllers.diplomaLevelController },
          response: ({ sample }: StubRouteCtx) => [
            sample.degreeLevelFetched,
            sample.degreeLevelFetched2,
          ],
        },
        {
          url: { controller: controllers.diplomaModuleController },
          response: ({ sample }: StubRouteCtx) => sample.skillsModulesFetched,
        },
      ],
      postRoutes: [
        {
          url: (ctx: StubRouteCtx) => {
            if (!ctx.post)
              throw new Error("[useAppFixtures] missing post in stub ctx");
            return ctx.post.endpoint;
          },
          response: (ctx: StubRouteCtx) => ctx.postResponse,
        },
      ],
    },

    createTaskItem: {
      getRoutes: [
        {
          url: { controller: controllers.taskLabelController },
          response: ({ sample }: StubRouteCtx) => [
            sample.taskFetched,
            sample.taskFetched2,
            sample.taskFetched3,
            sample.taskFetched4,
          ],
        },
      ],
      postRoutes: [
        {
          url: (ctx: StubRouteCtx) => {
            if (!ctx.post)
              throw new Error("[useAppFixtures] missing post in stub ctx");
            return ctx.post.endpoint;
          },
          response: (ctx: StubRouteCtx) => ctx.postResponse,
        },
      ],
    },

    createTaskTemplate: {
      getRoutes: [
        {
          // Match any by-degree-config URL (selected diploma drives the id)
          url: {
            controller: controllers.templatesControllerBase,
            mode: "prefix",
          },
          response: ({ sample }: StubRouteCtx) => sample.taskTemplateFetch,
        },
        {
          url: { controller: controllers.taskTemplatesAllController },
          response: ({ sample }: StubRouteCtx) => sample.taskTemplateFetch,
        },
        {
          url: { controller: controllers.taskLabelController },
          response: ({ sample }: StubRouteCtx) => [
            sample.taskFetched,
            sample.taskFetched2,
            sample.taskFetched3,
            sample.taskFetched4,
          ],
        },
        {
          url: { controller: controllers.diplomaModuleController },
          response: ({ sample }: StubRouteCtx) => sample.skillsModulesFetched,
        },
        {
          url: { controller: controllers.skillListController },
          response: ({ sample }: StubRouteCtx) => sample.skillsModulesFetched,
        },
      ],
      postRoutes: [
        {
          url: (ctx: StubRouteCtx) => {
            if (!ctx.post)
              throw new Error("[useAppFixtures] missing post in stub ctx");
            return ctx.post.endpoint;
          },
          response: (ctx: StubRouteCtx) => ctx.postResponse,
        },
      ],
    },

    createClassStepOne: {
      getRoutes: [
        {
          url: { controller: controllers.classesController },
          response: ({ sample }: StubRouteCtx) => ({
            [String(sample.classFetched.degreeLevel)]: [
              sample.classFetched,
              sample.classFetched2,
            ],
          }),
        },
        {
          url: { controller: controllers.diplomasController },
          response: ({ sample }: StubRouteCtx) => ({
            [sample.diplomaFetched.degreeField]: [
              sample.diplomaFetched,
              sample.diplomaFetched2,
            ],
          }),
        },
        {
          url: {
            controller: controllers.templatesControllerBase,
            mode: "prefix",
          },
          response: ({ sample }: StubRouteCtx) => sample.taskTemplateFetch,
        },
        {
          url: { controller: controllers.taskTemplatesAllController },
          response: ({ sample }: StubRouteCtx) => sample.taskTemplateFetch,
        },
        {
          url: { controller: controllers.studentsController },
          response: ({ sample }: StubRouteCtx) => [sample.studentFetched],
        },
        {
          url: { controller: controllers.diplomaModuleController },
          response: ({ sample }: StubRouteCtx) => sample.skillsModulesFetched,
        },
        {
          url: { controller: controllers.skillListController },
          response: ({ sample }: StubRouteCtx) => sample.skillsModulesFetched,
        },
        {
          url: { controller: controllers.taskLabelController },
          response: ({ sample }: StubRouteCtx) => [
            sample.taskFetched,
            sample.taskFetched2,
            sample.taskFetched3,
            sample.taskFetched4,
          ],
        },
        {
          url: { controller: controllers.diplomaModuleController },
          response: ({ sample }: StubRouteCtx) => sample.skillsModulesFetched,
        },
        {
          url: { controller: controllers.diplomaFieldController },
          response: ({ sample }: StubRouteCtx) => [
            sample.degreeFieldFetched,
            sample.degreeFieldFetched2,
          ],
        },
        {
          url: { controller: controllers.diplomaYearController },
          response: ({ sample }: StubRouteCtx) => [
            sample.degreeYearFetched,
            sample.degreeYearFetched2,
          ],
        },
        {
          url: { controller: controllers.diplomaLevelController },
          response: ({ sample }: StubRouteCtx) => [
            sample.degreeLevelFetched,
            sample.degreeLevelFetched2,
          ],
        },
      ],
      postRoutes: [
        {
          url: (ctx: StubRouteCtx) => {
            if (!ctx.post)
              throw new Error("[useAppFixtures] missing post in stub ctx");
            return ctx.post.endpoint;
          },
          response: (ctx: StubRouteCtx) => ctx.postResponse,
        },
        {
          url: POSTEndpoints.CREATE_DIPLOMA.endpoint,
          response: ({ sample }: StubRouteCtx) => sample.diplomaCreated,
        },
        {
          url: POSTEndpoints.CREATE_TASK_TEMPLATE.endpoint,
          response: ({ sample }: StubRouteCtx) => sample.taskTemplateCreated,
        },
        {
          url: POSTEndpoints.CREATE_TASK.endpoint,
          response: ({ sample }: StubRouteCtx) => sample.taskCreated,
        },
        {
          url: POSTEndpoints.CREATE_DEGREE.endpoints.FIELD,
          response: ({ sample }: StubRouteCtx) => sample.degreeCreatedResponse,
        },
        {
          url: POSTEndpoints.CREATE_DEGREE.endpoints.YEAR,
          response: ({ sample }: StubRouteCtx) => sample.degreeCreatedResponse,
        },
        {
          url: POSTEndpoints.CREATE_DEGREE.endpoints.LEVEL,
          response: ({ sample }: StubRouteCtx) => sample.degreeCreatedResponse,
        },
        {
          url: POSTEndpoints.CREATE_SKILL_MODULE.endpoint,
          response: ({ sample }: StubRouteCtx) => ({
            skill: sample.skillsModulesFetched.Skills[0],
          }),
        },
        {
          url: POSTEndpoints.CREATE_SKILL_SUBSKILL.endpoint,
          response: ({ sample }: StubRouteCtx) => ({
            skill: sample.skillsModulesFetched.Skills[0],
          }),
        },
      ],
    },
  }) as const;

function extractControllers(
  configs: Array<ControllersConfig<ControllerLike>>,
): Record<string, ControllerLike> {
  const result: Record<string, ControllerLike> = {};

  for (const cfg of configs) {
    const { controllerName, outputNames } = cfg;
    for (const [key, name] of Object.entries(outputNames)) {
      result[key] = controllerByName(controllerName, name);
    }
  }

  return result;
}

function controllerByName<T extends ControllerLike>(
  list: readonly T[],
  name: string,
): T {
  const found = list.find((c) => c.name === name);
  if (!found) throw new Error(`[useAppFixtures] controller not found: ${name}`);
  return found;
}

export function useAppFixtures() {
  const controllers = extractControllers(controllersConfig);
  const routeSpecs = routes(controllers);

  const {
    diplomaFieldController,
    diplomaYearController,
    diplomaLevelController,
    diplomaModuleController,
    diplomasController,
    studentsController,
    templatesControllerBase,
    taskLabelController,
    skillsController,
    classesController,
  } = controllers;

  // Keep a stable alias used by multiple flows (dynamic apiEndpoint may be a function).
  const templatesController = templatesControllerBase;

  const getRoutes = {
    newDegree: (type: "FIELD" | "YEAR" | "LEVEL") => {
      let controller = diplomaFieldController;
      let payload: unknown = [
        sample.degreeFieldFetched,
        sample.degreeFieldFetched2,
      ];

      const controllersForRoute = {
        diplomaFieldController,
        diplomaYearController,
        diplomaLevelController,
      };

      switch (type) {
        case "FIELD":
          controller = diplomaFieldController;
          payload = [sample.degreeFieldFetched, sample.degreeFieldFetched2];
          break;
        case "YEAR":
          controller = diplomaYearController;
          payload = [sample.degreeYearFetched, sample.degreeYearFetched2];
          break;
        case "LEVEL":
          controller = diplomaLevelController;
          payload = [sample.degreeLevelFetched, sample.degreeLevelFetched2];
          break;
      }

      const post = {
        endpoint: POSTEndpoints.CREATE_DEGREE.endpoints[type],
        dataReshapeFn: POSTEndpoints.CREATE_DEGREE.dataReshapeFn,
      };

      const installFetchStubs: InstallFetchStubs = (
        postResponse = sample.degreeCreatedResponse,
      ) =>
        stubFetchRoutes({
          getRoutes: [[String(controller.apiEndpoint), payload]],
          postRoutes: [[post.endpoint, postResponse]],
        });

      return {
        controllers: controllersForRoute,
        post,
        installFetchStubs,
        sample,
      };
    },

    createDiploma: () => {
      const post = POSTEndpoints.CREATE_DIPLOMA;

      const installFetchStubs: InstallFetchStubs = (
        postResponse = sample.diplomaCreated,
      ) =>
        stubFetchRoutes(
          buildFetchStubs(routeSpecs.createDiploma, {
            controllers,
            sample,
            post,
            postResponse,
          }),
        );

      return {
        controllers: {
          diplomasController,
          diplomaFieldController,
          diplomaYearController,
          diplomaLevelController,
          diplomaModuleController,
        },
        post,
        installFetchStubs,
        sample,
      };
    },

    createTaskItem: () => {
      const post = POSTEndpoints.CREATE_TASK;

      const installFetchStubs: InstallFetchStubs = (
        postResponse = sample.taskCreated,
      ) =>
        stubFetchRoutes(
          buildFetchStubs(routeSpecs.createTaskItem, {
            controllers,
            sample,
            post,
            postResponse,
          }),
        );

      return {
        controllers: { taskLabelController },
        post,
        installFetchStubs,
        sample,
      };
    },

    createTaskTemplate: () => {
      const post = POSTEndpoints.CREATE_TASK_TEMPLATE;

      const installFetchStubs: InstallFetchStubs = (
        postResponse = sample.taskTemplateCreated,
      ) =>
        stubFetchRoutes(
          buildFetchStubs(routeSpecs.createTaskTemplate, {
            controllers,
            sample,
            post,
            postResponse,
          }),
        );

      return {
        controllers: {
          templatesController,
          taskLabelController,
          skillsController,
        },
        post,
        installFetchStubs,
        sample,
      };
    },

    createClassStepOne: (opts?: { createClassPostResponse?: unknown }) => {
      const post = POSTEndpoints.CREATE_CLASS;

      const createClassPostResponse =
        opts?.createClassPostResponse ?? sample.classCreated;

      const installFetchStubs: InstallFetchStubs = () =>
        stubFetchRoutes(
          buildFetchStubs(routeSpecs.createClassStepOne, {
            controllers,
            sample,
            post,
            postResponse: createClassPostResponse,
          }),
        );

      return {
        controllers: {
          classesController,
          diplomasController,
          tasksController: templatesController,
          taskLabelController,
          skillsController,
          studentsController,
        },
        post,
        installFetchStubs,
        sample,
      };
    },
  };

  return { getRoutes, sample };
}
