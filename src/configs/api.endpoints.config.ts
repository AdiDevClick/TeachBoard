import { ObjectReshape } from "@/utils/ObjectReshape.ts";

import type {
  ClassesFetch,
  CreateClassResponseData,
} from "@/api/types/routes/classes.types";
import type {
  CreateDegreeResponseData,
  DegreesFetch,
} from "@/api/types/routes/degrees.types";
import type {
  CreateDiplomaResponseData,
  DiplomasFetch,
} from "@/api/types/routes/diplomas.types";
import type {
  CreateSkillResponseData,
  SkillDto,
  SkillsFetch,
} from "@/api/types/routes/skills.types";
import type { StudentsFetch } from "@/api/types/routes/students.types";
import type {
  CreateTaskTemplateResponseData,
  TaskTemplatesFetch,
} from "@/api/types/routes/task-templates.types";
import type {
  CreateTaskResponseData,
  TasksFetch,
} from "@/api/types/routes/tasks.types";
import type { TeachersFetch } from "@/api/types/routes/teachers.types";

const BASE_API_URL = "/api";

//

const AUTH = `${BASE_API_URL}/auth`;
const DEGREES = `${BASE_API_URL}/degrees`;
const SKILLS = `${BASE_API_URL}/skills`;
const STUDENTS = `${BASE_API_URL}/students`;
const TEACHERS = `${BASE_API_URL}/teachers`;
const CLASSES = `${BASE_API_URL}/classes`;

/**
 * API Endpoints Configuration
 * This file is used as a buffer between frontend and backend.
 *
 * @description <CommandList/> await structure :
 * { groupTitle: string, items: Array }
 * @description Each <CommandItem/> await structure :
 * { id: number | string, value: string, ... }
 *
 * @remarks Endpoints are grouped by HTTP method (GET, POST).
 *
 * @remarks Data reshaping is handled using ObjectReshape utility for consistency.
 * ObjectReshape allows transformations to adapt server responses to frontend needs.
 * It uses proxy pattern
 */
export const API_ENDPOINTS = Object.freeze({
  GET: {
    METHOD: "GET",
    CLASSES: {
      endPoints: {
        ALL: `${CLASSES}/`,
        BY_ID: (id: number | string) => `${BASE_API_URL}/classes/${id}`,
      },
      dataReshape: (data: ClassesFetch) =>
        // use "code" and transform to "value" for selects
        // data.classes is the actual array of classes from the server response
        dataReshaper(data)
          // .rename("classes", "items")
          .transformTuplesToGroups("groupTitle", "items")
          // .assignSourceTo("items")
          // .addToRoot({ groupTitle: "Tous" })
          .assign([["name", "value"]])
          .newShape(),
    },
    SKILLS: {
      endPoints: { MODULES: `${SKILLS}/main`, SUBSKILLS: `${SKILLS}/sub` },
      dataReshape: (data: SkillsFetch) =>
        dataReshaper(data)
          // data.Skills is the actual array of skills from the server response
          .rename("Skills", "items")
          .addToRoot({ groupTitle: "Tous" })
          // use "code" and transform to "value" for selects
          .assign([["code", "value"]])
          .newShape(),
    },
    DEGREES: {
      endpoints: {
        LEVEL: `${DEGREES}/level`,
        YEAR: `${DEGREES}/year`,
        FIELD: `${DEGREES}/field`,
      },
      dataReshape: (data: DegreesFetch) =>
        dataReshaper(data)
          .assignSourceTo("items")
          .addToRoot({ groupTitle: "Tous" })
          // use "name" and transform to "value" for selects
          .assign([["name", "value"]])
          .newShape(),
    },
    DIPLOMAS: {
      endpoint: `${DEGREES}/config`,
      dataReshape: (data: DiplomasFetch) =>
        dataReshaper(data)
          // Tuple key for all entries will be : { groupTitle: "Bachelor", items: [...] }
          // Instead of : { "Bachelor" : [...] }
          .transformTuplesToGroups("groupTitle", "items")
          // A new output will be create under "description" in each "items"
          .createPropertyWithContentFromKeys(
            ["degreeLevel", "degreeYear"],
            "description",
            " "
          )
          // "description" will be transformed to "value" for selects
          .assign([["description", "value"]])
          .newShape(),
    },
    TASKSTEMPLATES: {
      endpoints: {
        ALL: `${BASE_API_URL}/task-templates`,
        BY_DIPLOMA_ID: (id: number | string) =>
          `${BASE_API_URL}/task-templates/by-degree-config/${id}`,
      },
      dataReshape: (data: TaskTemplatesFetch) =>
        dataReshaper(data.taskTemplates)
          .selectElementsTo(["task", "id"], "items")
          .addToRoot({
            groupTitle: "Tous",
            shortTemplatesList: data.shortTemplatesList ?? [],
          })
          .assign([["name", "value"]])
          .newShape(),
    },
    TASKS: {
      endpoint: `${BASE_API_URL}/tasks`,
      dataReshape: (data: TasksFetch) =>
        dataReshaper(data)
          .assignSourceTo("items")
          .addToRoot({ groupTitle: "Tous" })
          .assign([["name", "value"]])
          .newShape(),
    },
    STUDENTS: {
      endpoint: `${STUDENTS}/not-assigned`,
      dataReshape: (data: StudentsFetch) =>
        dataReshaper(data)
          .assignSourceTo("items")
          .addToRoot({ groupTitle: "Tous" })
          .createPropertyWithContentFromKeys(
            ["firstName", "lastName"],
            "fullName",
            " "
          )
          .setProxyPropertyWithContent("newRole", "Etudiant")
          .assign([
            ["fullName", "value"],
            ["fullName", "name"],
            ["newRole", "email"],
            ["img", "avatar"],
          ])
          .newShape(),
    },
    TEACHERS: {
      endpoint: `${TEACHERS}/`,
      dataReshape: (data: TeachersFetch) =>
        dataReshaper(data)
          .assignSourceTo("items")
          .addToRoot({ groupTitle: "Tous" })
          .createPropertyWithContentFromKeys(
            ["firstName", "lastName"],
            "fullName",
            " "
          )
          .setProxyPropertyWithContent("newRole", "Enseignant")
          .assign([
            ["fullName", "value"],
            ["fullName", "name"],
            ["newRole", "email"],
            ["img", "avatar"],
          ])
          .newShape(),
    },
    COURSES: `${BASE_API_URL}/courses`,
    USERS: `${BASE_API_URL}/users`,
    POSTS: `${BASE_API_URL}/posts`,
    AUTH: {
      SIGNUP_VALIDATION: `${AUTH}/verify/`,
    },
  },
  POST: {
    METHOD: "POST",
    CREATE_CLASS: {
      endpoint: `${CLASSES}`,
      dataReshape: (
        data: CreateClassResponseData,
        cachedDatas: CachedQueriesData | undefined
      ) => {
        const newItem = {
          ...data,
          value: data?.name,
        };
        return reshapeItemToCachedData(newItem, cachedDatas, data.degreeLevel);
      },
    },
    AUTH: {
      LOGIN: {
        endpoint: `${AUTH}/login`,
        dataReshape: (
          data: unknown,
          _cachedDatas: unknown,
          options: {
            login: (payload: {
              userId?: unknown;
              username?: unknown;
              firstName?: unknown;
              lastName?: unknown;
              name?: string;
              email?: unknown;
              role?: unknown;
              token?: unknown;
              refreshToken?: unknown;
              avatar?: unknown;
              schoolName?: unknown;
            }) => void;
          }
        ) => {
          const payload = (data ?? {}) as Record<string, unknown>;
          const user = (payload.user ?? {}) as Record<string, unknown>;
          const firstName = user.firstName;
          const lastName = user.lastName;

          options.login({
            userId: user.id,
            username: user.username,
            firstName,
            lastName,
            name:
              typeof firstName === "string" && typeof lastName === "string"
                ? firstName + " " + lastName
                : "",
            email: user.email,
            role: user.role,
            token: payload.session,
            refreshToken: payload.refreshToken,
            avatar: user.avatar,
            schoolName: user.schoolName,
          });

          return data;
        },
      },
      SIGNUP: `${AUTH}/signup`,
      PASSWORD_CREATION: `${AUTH}/password-creation`,
      PASSWORD_RECOVERY: {
        endpoint: `${AUTH}/password-recovery`,
        dataReshape: (data: unknown) => data,
      },
      SESSION_CHECK: `${AUTH}/session`,
      LOGOUT: `${AUTH}/logout`,
    },
    CREATE_DEGREE: {
      endpoints: {
        LEVEL: `${DEGREES}/level`,
        YEAR: `${DEGREES}/year`,
        FIELD: `${DEGREES}/field`,
      },
      dataReshape: (
        data: CreateDegreeResponseData,
        cachedDatas: CachedQueriesData | undefined
      ) => {
        const degree = data?.degree;
        // grab id and name from data.degree only
        const newItem = {
          ...degree,
          value: degree?.name,
        };

        return reshapeItemToCachedData(newItem, cachedDatas, "Tous");
      },
    },
    CREATE_SKILL: {
      endPoints: { MODULE: `${SKILLS}/main`, SUBSKILL: `${SKILLS}/sub` },
      dataReshape: (
        data: CreateSkillResponseData,
        cachedDatas: CachedQueriesData | undefined
      ) => {
        // Extract the actual skill data from the response
        const skillData =
          data && typeof data === "object" && "skill" in data
            ? (data as { skill: SkillDto }).skill
            : data;

        // Mapping code -> value
        const newItem = {
          ...skillData,
          value: skillData.code,
        };

        return reshapeItemToCachedData(newItem, cachedDatas, "Tous");
      },
    },
    CREATE_DIPLOMA: {
      endpoint: `${DEGREES}/config`,
      dataReshape: (
        data: CreateDiplomaResponseData,
        cachedDatas: CachedQueriesData | undefined
      ) => {
        const newItem = {
          ...data,
          value: data?.degreeLevel + " " + data?.degreeYear,
        };

        return reshapeItemToCachedData(newItem, cachedDatas, data.degreeField);
      },
    },
    CREATE_TASK_TEMPLATE: {
      endpoint: `${BASE_API_URL}/task-templates`,
      dataReshape: (
        data: CreateTaskTemplateResponseData,
        cachedDatas: CachedQueriesData | undefined
      ) => {
        const newItem = {
          id: data.id,
          description: data.task.description,
          value: data.task.name,
        };
        return reshapeItemToCachedData(newItem, cachedDatas, "Tous");
      },
    },
    CREATE_TASK: {
      endpoint: `${BASE_API_URL}/tasks`,
      dataReshape: (
        data: CreateTaskResponseData,
        cachedDatas: CachedQueriesData | undefined
      ) => {
        const newItem = {
          ...data,
          value: data.name,
        };
        return reshapeItemToCachedData(newItem, cachedDatas, "Tous");
      },
    },
  },
} as const);

type CachedQueriesData = Array<[unknown, unknown]>;

/**
 * Reshape data using ObjectReshape utility
 * @param data - The raw data to be reshaped
 * @returns The reshaped data
 */
function dataReshaper(data: unknown) {
  // Reshape data for caching
  const reshaper = new ObjectReshape(
    data as Record<string, unknown> | Array<Record<string, unknown>>
  );
  return reshaper;
}

/**
 * Get cached data from the cached queries data structure
 *
 * @param cachedDatas
 * @returns  The extracted cached data array
 */
function getCachedDatas(cachedDatas: CachedQueriesData | undefined) {
  if (!cachedDatas) return [];
  const array = cachedDatas?.[0];
  const data = array?.[1];

  const isArray = Array.isArray(data);

  if (isArray && data.length > 0) return data;

  const maybeIndexed = data as { 0?: unknown } | undefined;
  return maybeIndexed?.[0] ?? [];
}

/**
 * Reshape a new item into the cached data structure
 *
 * @description structure : { groupTitle: string, items: Array }
 *
 * @param newItem The new item to be reshaped and added
 * @param cachedDatas The existing cached data structure
 * @param groupConditionValue The group condition value for grouping items
 * @returns The reshaped data structure with the new item added
 */
function reshapeItemToCachedData(
  newItem: Record<string, unknown>,
  cachedDatas: CachedQueriesData | undefined,
  groupConditionValue: string
) {
  const existingData = getCachedDatas(cachedDatas);
  return dataReshaper(existingData)
    .addTo(newItem, "items", "groupTitle", groupConditionValue)
    .newShape();
}
