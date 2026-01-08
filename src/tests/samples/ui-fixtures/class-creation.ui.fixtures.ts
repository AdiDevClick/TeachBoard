import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  classCreationInputControllers,
  diplomaCreationInputControllers,
  stepOneInputControllers,
  taskItemInputControllers,
  taskTemplateCreationInputControllers,
} from "@/data/inputs-controllers.data";
import {
  classCreated,
  classFetched,
  classFetched2,
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
  taskFetched,
  taskFetched2,
  taskTemplateCreated,
  taskTemplateFetch,
} from "@/tests/samples/class-creation-sample-datas";
import { stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";

export function fixtureCreateDiplomaFromClassCreation(opts?: {
  diplomaPostResponse?: typeof diplomaCreated;
}) {
  const diplomasController = classCreationInputControllers.find(
    (c) => c.name === "degreeConfigId" && c.task === "create-diploma"
  )!;

  const diplomaFieldController = diplomaCreationInputControllers.find(
    (c) => c.name === "diplomaFieldId"
  )!;
  const diplomaYearController = diplomaCreationInputControllers.find(
    (c) => c.name === "yearId"
  )!;
  const diplomaLevelController = diplomaCreationInputControllers.find(
    (c) => c.name === "levelId"
  )!;
  const diplomaModuleController = diplomaCreationInputControllers.find(
    (c) => c.name === "mainSkillsList"
  )!;

  const postRoute = API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint;
  const postDataReshapeFn = API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape;

  const installFetchStubs = () =>
    stubFetchRoutes({
      getRoutes: [
        [
          diplomasController.apiEndpoint,
          { [diplomaFetched.degreeField]: [diplomaFetched, diplomaFetched2] },
        ],
        [
          diplomaFieldController.apiEndpoint,
          [degreeFieldFetched, degreeFieldFetched2],
        ],
        [
          diplomaYearController.apiEndpoint,
          [degreeYearFetched, degreeYearFetched2],
        ],
        [
          diplomaLevelController.apiEndpoint,
          [degreeLevelFetched, degreeLevelFetched2],
        ],
        [diplomaModuleController.apiEndpoint, skillsModulesFetched],
      ],
      postRoutes: [[postRoute, opts?.diplomaPostResponse ?? diplomaCreated]],
      defaultGetPayload: [],
    });

  const post = {
    endpoint: postRoute,
    dataReshapeFn: postDataReshapeFn,
  };

  return {
    installFetchStubs,
    post,
    controllers: {
      diplomasController,
      diplomaFieldController,
      diplomaYearController,
      diplomaLevelController,
      diplomaModuleController,
    },
    sample: {
      degreeFieldFetched,
      degreeYearFetched,
      degreeLevelFetched,
      skillsModulesFetched,
      diplomaFetched,
      diplomaFetched2,
      diplomaCreated: opts?.diplomaPostResponse ?? diplomaCreated,
    },
  };
}

export function fixtureCreateClassStepOne(opts?: {
  createClassPostResponse?: typeof classCreated;
}) {
  const classesController = stepOneInputControllers.find(
    (c) => c.name === "classe"
  )!;

  const diplomasController = classCreationInputControllers.find(
    (c) => c.name === "degreeConfigId" && c.task === "create-diploma"
  )!;

  const tasksControllerBase = classCreationInputControllers.find(
    (c) => c.name === "tasks"
  )!;

  const tasksController = {
    ...tasksControllerBase,
    apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
      diplomaFetched.id
    ),
  };

  const taskLabelController = taskTemplateCreationInputControllers.find(
    (c) => c.name === "taskId"
  )!;

  const skillsController = taskTemplateCreationInputControllers.find(
    (c) => c.name === "skills"
  )!;

  const studentsController = classCreationInputControllers.find(
    (c) => c.name === "students"
  )!;

  const postRoute = API_ENDPOINTS.POST.CREATE_CLASS.endpoint;
  const postDataReshapeFn = API_ENDPOINTS.POST.CREATE_CLASS.dataReshape;

  const installFetchStubs = () =>
    stubFetchRoutes({
      getRoutes: [
        [
          classesController.apiEndpoint,
          {
            [String(classFetched.degreeLevel)]: [classFetched, classFetched2],
          },
        ],
        // Also stub canonical endpoints to be robust to trailing slash variants
        [
          API_ENDPOINTS.GET.CLASSES.endPoints.ALL,
          {
            [String(classFetched.degreeLevel)]: [classFetched, classFetched2],
          },
        ],
        [
          API_ENDPOINTS.GET.CLASSES.endPoints.ALL.replace(/\/$/, ""),
          {
            [String(classFetched.degreeLevel)]: [classFetched, classFetched2],
          },
        ],
        // Stub diplomas, tasks and students used in the Step One flow
        [
          diplomasController.apiEndpoint,
          { [diplomaFetched.degreeField]: [diplomaFetched, diplomaFetched2] },
        ],
        [tasksController.apiEndpoint, taskTemplateFetch],
        // Also stub the templates endpoint for the second diploma, so tests can
        // switch diplomas and still exercise the real "by diploma" query.
        [
          API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
            diplomaFetched2.id
          ),
          taskTemplateFetch,
        ],
        // Task list used by the nested "new task template" modal (taskId field)
        [API_ENDPOINTS.GET.TASKS.endpoint, [taskFetched, taskFetched2]],
        [studentsController.apiEndpoint, [studentFetched]],
      ],
      postRoutes: [[postRoute, opts?.createClassPostResponse ?? classCreated]],
      defaultGetPayload: [],
    });

  const post = {
    endpoint: postRoute,
    dataReshapeFn: postDataReshapeFn,
  };

  return {
    installFetchStubs,
    post,
    controllers: {
      classesController,
      diplomasController,
      tasksController,
      studentsController,
      taskLabelController,
      skillsController,
    },
    endpoints: {
      postRoute,
    },
    sample: {
      classFetched,
      classFetched2,
      classCreated: opts?.createClassPostResponse ?? classCreated,
      diplomaFetched,
      diplomaFetched2,
      taskFetched,
      studentFetched,
    },
  };
}

export function fixtureNewDegreeItem(kind: "FIELD" | "YEAR" | "LEVEL") {
  let ctrlName: "diplomaFieldId" | "yearId" | "levelId";
  if (kind === "FIELD") ctrlName = "diplomaFieldId";
  else if (kind === "YEAR") ctrlName = "yearId";
  else ctrlName = "levelId";

  const controller = diplomaCreationInputControllers.find(
    (c) => c.name === ctrlName
  )!;

  let getPayload: unknown;
  if (kind === "FIELD") getPayload = [degreeFieldFetched, degreeFieldFetched2];
  else if (kind === "YEAR")
    getPayload = [degreeYearFetched, degreeYearFetched2];
  else getPayload = [degreeLevelFetched, degreeLevelFetched2];

  let postEndpoint: string;
  if (kind === "FIELD")
    postEndpoint = API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.FIELD;
  else if (kind === "YEAR")
    postEndpoint = API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.YEAR;
  else postEndpoint = API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.LEVEL;

  const post = {
    endpoint: postEndpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape,
  };

  const installFetchStubs = (postResponse: unknown) =>
    stubFetchRoutes({
      getRoutes: [[controller.apiEndpoint, getPayload]],
      postRoutes: [[postEndpoint, postResponse]],
      defaultGetPayload: [],
    });

  return {
    controller,
    getPayload,
    postEndpoint,
    post,
    installFetchStubs,
  };
}

export function fixtureNewTaskTemplate() {
  const templatesControllerBase = classCreationInputControllers.find(
    (c) => c.name === "tasks"
  )!;

  const skillsController = taskTemplateCreationInputControllers.find(
    (c) => c.name === "skills"
  )!;

  const taskLabelController = taskTemplateCreationInputControllers.find(
    (c) => c.name === "taskId"
  )!;

  const diplomasController = classCreationInputControllers.find(
    (c) => c.name === "degreeConfigId" && c.task === "create-diploma"
  )!;

  const templatesController = {
    ...templatesControllerBase,
    apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
      diplomaFetched.id
    ),
    selectedDiploma: diplomaFetched,
  };

  const installFetchStubs = () =>
    stubFetchRoutes({
      getRoutes: [
        [
          diplomasController.apiEndpoint,
          { [diplomaFetched.degreeField]: [diplomaFetched, diplomaFetched2] },
        ],
        [taskLabelController.apiEndpoint, [taskFetched, taskFetched2]],
        [templatesController.apiEndpoint, taskTemplateFetch],
        // Also stub the global task templates endpoint (used in some flows)
        [API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.ALL, taskTemplateFetch],
      ],
      postRoutes: [
        [API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint, taskTemplateCreated],
      ],
      defaultGetPayload: [],
    });

  const post = {
    endpoint: API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape,
  };

  return {
    installFetchStubs,
    post,
    controllers: {
      diplomasController,
      templatesController,
      skillsController,
      taskLabelController,
    },
    sample: {
      diplomaFetched,
      diplomaFetched2,
      taskFetched,
      taskFetched2,
      taskTemplateCreated,
      taskTemplateFetch,
    },
  };
}

export function fixtureNewTaskItem() {
  const taskController = taskTemplateCreationInputControllers.find(
    (c) => c.name === "taskId"
  )!;

  const post = {
    endpoint: API_ENDPOINTS.POST.CREATE_TASK.endpoint,
    dataReshapeFn: API_ENDPOINTS.POST.CREATE_TASK.dataReshape,
  };

  const installFetchStubs = (postResponse: unknown) =>
    stubFetchRoutes({
      getRoutes: [[taskController.apiEndpoint, [taskFetched, taskFetched2]]],
      postRoutes: [[API_ENDPOINTS.POST.CREATE_TASK.endpoint, postResponse]],
      defaultGetPayload: [],
    });

  return {
    installFetchStubs,
    post,
    controller: taskController,
    sample: {
      taskFetched,
      taskFetched2,
      taskItemInputControllers,
    },
  };
}
