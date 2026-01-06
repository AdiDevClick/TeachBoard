import type {
  ClassDto,
  CreateClassResponseData,
} from "@/api/types/routes/classes.types.ts";
import type {
  CreateDegreeResponseData,
  DegreeRefDto,
} from "@/api/types/routes/degrees.types.ts";
import type {
  CreateDiplomaResponseData,
  DiplomaConfigDto,
} from "@/api/types/routes/diplomas.types.ts";
import type { SkillsViewDto } from "@/api/types/routes/skills.types.ts";
import type { StudentDto } from "@/api/types/routes/students.types.ts";
import type {
  CreateTaskTemplateResponseData,
  TaskTemplateDto,
  TaskTemplatesFetch,
} from "@/api/types/routes/task-templates.types.ts";
import type {
  CreateTaskResponseData,
  TaskDto,
} from "@/api/types/routes/tasks.types.ts";
import type { TeacherDto } from "@/api/types/routes/teachers.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { AppModalNames } from "@/configs/app.config.ts";

export const degreeFieldModal: AppModalNames = "new-degree-item-field";
export const degreeYearModal: AppModalNames = "new-degree-item-year";
export const degreeLevelModal: AppModalNames = "new-degree-item-degree";
export const diplomaModal: AppModalNames = "create-diploma";
export const taskModal: AppModalNames = "new-task-item";
export const taskTemplateModal: AppModalNames = "new-task-template";
export const classCreationModal: AppModalNames = "class-creation";

export const degreeFieldEndpoint = API_ENDPOINTS.GET.DEGREES.endpoints.FIELD;
export const degreeYearEndpoint = API_ENDPOINTS.GET.DEGREES.endpoints.YEAR;
export const degreeLevelEndpoint = API_ENDPOINTS.GET.DEGREES.endpoints.LEVEL;
export const diplomaEndpoint = API_ENDPOINTS.GET.DIPLOMAS.endpoint;
export const tasksEndpoint = API_ENDPOINTS.GET.TASKS.endpoint;
export const taskTemplatesEndpoint =
  API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.ALL;
export const classesEndpoint = API_ENDPOINTS.GET.CLASSES.endPoints.ALL;

export const degreeFieldQueryKey = [
  degreeFieldModal,
  degreeFieldEndpoint,
] as const;
export const degreeYearQueryKey = [
  degreeYearModal,
  degreeYearEndpoint,
] as const;
export const degreeLevelQueryKey = [
  degreeLevelModal,
  degreeLevelEndpoint,
] as const;
export const diplomaQueryKey = [diplomaModal, diplomaEndpoint] as const;
export const tasksQueryKey = [taskModal, tasksEndpoint] as const;
export const taskTemplatesQueryKey = [
  taskTemplateModal,
  taskTemplatesEndpoint,
] as const;
export const classesQueryKey = [classCreationModal, classesEndpoint] as const;

export const degreeFieldFetched: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000101",
  name: "Cuisine",
  code: "CUIS",
  type: "FIELD",
};

export const degreeFieldFetched2: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000105",
  name: "Informatique",
  code: "INFO",
  type: "FIELD",
};

export const degreeYearFetched: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000103",
  name: "1A",
  code: "1A",
  type: "YEAR",
};

export const degreeYearFetched2: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000106",
  name: "3A",
  code: "3A",
  type: "YEAR",
};

export const degreeLevelFetched: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000104",
  name: "BTS",
  code: "BTS",
  type: "LEVEL",
};

export const degreeLevelFetched2: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000107",
  name: "Master",
  code: "MAS",
  type: "LEVEL",
};

export const degreeCreated: DegreeRefDto = {
  id: "00000000-0000-4000-8000-000000000102",
  name: "Licence",
  code: "LIC",
  type: "FIELD",
};

export const degreeCreatedResponse: CreateDegreeResponseData = {
  degree: degreeCreated,
};

export const diplomaFetchedSkills: SkillsViewDto[] = [
  {
    mainSkillId: "00000000-0000-4000-8000-000000000901",
    mainSkillCode: "MAIN_2F90AB",
    mainSkillName: "Module cuisine",
    subSkills: [
      {
        id: "00000000-0000-4000-8000-000000000902",
        code: "SUB_01",
        name: "Découper",
      },
      {
        id: "00000000-0000-4000-8000-000000000903",
        code: "SUB_02",
        name: "Cuire",
      },
    ],
  },
];

export const diplomaFetched: DiplomaConfigDto = {
  id: "00000000-0000-4000-8000-000000000201",
  degreeField: "Cuisine",
  degreeLevel: "BTS",
  degreeYear: "1A",
  skills: diplomaFetchedSkills,
};

export const diplomaFetched2: DiplomaConfigDto = {
  id: "00000000-0000-4000-8000-000000000203",
  degreeField: "Cuisine",
  degreeLevel: "BTS",
  degreeYear: "3A",
  skills: diplomaFetchedSkills,
};

export const diplomaCreated: CreateDiplomaResponseData = {
  id: "00000000-0000-4000-8000-000000000202",
  degreeField: "Cuisine",
  degreeLevel: "BTS",
  degreeYear: "2A",
};

export const taskFetched: TaskDto = {
  id: "00000000-0000-4000-8000-000000000301",
  name: "Installer un switch",
  description: "...",
};

export const taskFetched2: TaskDto = {
  id: "00000000-0000-4000-8000-000000000303",
  name: "Câbler une baie",
  description: "...",
};

export const taskCreated: CreateTaskResponseData = {
  id: "00000000-0000-4000-8000-000000000302",
  name: "Configurer un routeur",
  description: "...",
};

export const taskTemplateFetched: TaskTemplateDto = {
  id: "00000000-0000-4000-8000-000000000401",
  task: {
    id: "00000000-0000-4000-8000-000000000301",
    name: "Installer un switch",
    description: "...",
  },
};

export const taskTemplateFetched2: TaskTemplateDto = {
  id: "00000000-0000-4000-8000-000000000403",
  task: {
    id: "00000000-0000-4000-8000-000000000303",
    name: "Câbler une baie",
    description: "...",
  },
};

export const taskTemplateFetch: TaskTemplatesFetch = {
  taskTemplates: [taskTemplateFetched, taskTemplateFetched2],
  shortTemplatesList: ["short-1", "short-2"],
};

export const taskTemplateCreated: CreateTaskTemplateResponseData = {
  id: "00000000-0000-4000-8000-000000000402",
  task: {
    id: "00000000-0000-4000-8000-000000000302",
    name: "Configurer un routeur",
    description: "...",
  },
};

export const classFetched: ClassDto = {
  id: "00000000-0000-4000-8000-000000000501",
  name: "1A",
  description: "desc",
  degreeLevel: "BTS",
};

export const classFetched2: ClassDto = {
  id: "00000000-0000-4000-8000-000000000503",
  name: "1B",
  description: "desc",
  degreeLevel: "BTS",
};

export const classCreated: CreateClassResponseData = {
  id: "00000000-0000-4000-8000-000000000502",
  name: "2B",
  description: "desc",
  degreeLevel: "BTS",
};

export const studentFetched: StudentDto = {
  id: "00000000-0000-4000-8000-000000000701",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

export const studentFetched2: StudentDto = {
  id: "00000000-0000-4000-8000-000000000702",
  firstName: "Alice",
  lastName: "Smith",
  email: "alice.smith@example.com",
};

export const teacherFetched: TeacherDto = {
  id: "00000000-0000-4000-8000-000000000801",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
};

export const teacherFetched2: TeacherDto = {
  id: "00000000-0000-4000-8000-000000000802",
  firstName: "Bob",
  lastName: "Martin",
  email: "bob.martin@example.com",
};

export const skillsModulesFetched = {
  Skills: [
    {
      id: "00000000-0000-0000-0000-000000000901",
      code: "MAIN_2F90AB",
      name: "Module cuisine",
      type: "MAIN",
    },
    {
      id: "00000000-0000-0000-0000-000000000904",
      code: "MAIN_F4B12C",
      name: "Module réseaux",
      type: "MAIN",
    },
  ],
} as const;

// Backwards-compatible alias for existing tests
export const degreeFetched = degreeFieldFetched;
