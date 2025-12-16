import { ObjectReshape } from "@/utils/ObjectReshape.ts";

const BASE_API_URL = "/api";
const API_VERSION = "v1";

//

const AUTH = `${BASE_API_URL}/auth`;
const DEGREES = `${BASE_API_URL}/degrees`;
const SKILLS = `${BASE_API_URL}/skills`;

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
        ALL: `${BASE_API_URL}/classes/`,
        BY_ID: (id: number | string) => `${BASE_API_URL}/classes/${id}`,
      },
      dataReshape: (data: any) =>
        // use "code" and transform to "value" for selects
        // data.classes is the actual array of classes from the server response
        dataReshaper(data)
          .rename("classes", "items")
          .add({ groupTitle: "Tous" })
          // .assign([["code", "value"]])
          .newShape(),
    },
    SKILLS: {
      endPoints: { MODULES: `${SKILLS}/main`, SUBSKILLS: `${SKILLS}/sub` },
      dataReshape: (data: any) =>
        dataReshaper(data)
          // data.Skills is the actual array of skills from the server response
          .rename("Skills", "items")
          .add({ groupTitle: "Tous" })
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
      dataReshape: (data: any) =>
        dataReshaper(data)
          .assignSourceTo("items")
          .add({ groupTitle: "Tous" })
          // use "name" and transform to "value" for selects
          .assign([["name", "value"]])
          .newShape(),
    },
    DIPLOMAS: {
      endpoint: `${DEGREES}/config`,
      dataReshape: (data: any) =>
        dataReshaper(data)
          // Tuple key for all entries will be : { groupTitle: "Bachelor", items: [...] }
          // Instead of : { "Bachelor" : [...] }
          .transformTuplesToGroups("groupTitle", "items")
          // A new output will be create under "description" in each "items"
          .createOutput(["degreeLevel", "degreeYear"], "description", " ")
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
      dataReshape: (data: any) =>
        dataReshaper(data)
          .selectElementsTo(["task", "id"], "items")
          .add({ groupTitle: "Tous" })
          .assign([["name", "value"]])
          .newShape(),
    },
    TASKS: {
      endpoint: `${BASE_API_URL}/tasks`,
      dataReshape: (data: any) =>
        dataReshaper(data)
          .assignSourceTo("items")
          .add({ groupTitle: "Tous" })
          .assign([["name", "value"]])
          .newShape(),
    },
    STUDENTS: `${BASE_API_URL}/students`,
    COURSES: `${BASE_API_URL}/courses`,
    USERS: `${BASE_API_URL}/users`,
    POSTS: `${BASE_API_URL}/posts`,
    AUTH: {
      SIGNUP_VALIDATION: `${AUTH}/verify/`,
    },
  },
  POST: {
    METHOD: "POST",
    CREATE_CLASS: `${BASE_API_URL}/classes`,
    AUTH: {
      LOGIN: `${AUTH}/login`,
      SIGNUP: `${AUTH}/signup`,
      PASSWORD_CREATION: `${AUTH}/password-creation`,
      PASSWORD_RECOVERY: `${AUTH}/password-recovery`,
      SESSION_CHECK: `${AUTH}/session`,
      LOGOUT: `${AUTH}/logout`,
    },
    CREATE_DEGREE: {
      endpoints: {
        LEVEL: `${DEGREES}/level`,
        YEAR: `${DEGREES}/year`,
        FIELD: `${DEGREES}/field`,
      },
      dataReshape: (data: any, cachedDatas) => {
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
      dataReshape: (data: any, cachedDatas) => {
        // Extract the actual skill data from the response
        const skillData = data?.skill || data;

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
      dataReshape: (data: any, cachedDatas: unknown) => {
        const newItem = {
          ...data,
          value: data?.degreeLevel + " " + data?.degreeYear,
        };

        return reshapeItemToCachedData(newItem, cachedDatas, data.degreeField);
      },
    },
    CREATE_TASK_TEMPLATE: {
      endpoint: `${BASE_API_URL}/task-templates`,
      dataReshape: (data: any, cachedDatas: unknown) => {
        const newItem = {
          ...data,
          value: data.task.name,
          // value: data.name,
        };
        return reshapeItemToCachedData(newItem, cachedDatas, "Tous");
      },
    },
    CREATE_TASK: {
      endpoint: `${BASE_API_URL}/tasks`,
      dataReshape: (data: any, cachedDatas: unknown) => {
        const newItem = {
          ...data,
          value: data.name,
        };
        return reshapeItemToCachedData(newItem, cachedDatas, "Tous");
      },
    },
  },
} as const);

function dataReshaper(data: any) {
  // Reshape data for caching
  const reshaper = new ObjectReshape(data);
  return reshaper;
}

function getCachedDatas(cachedDatas: unknown) {
  const array = cachedDatas?.[0];
  const data = array?.[1];
  if (data?.length > 0) return data;
  return data?.[0];
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
  newItem: any,
  cachedDatas: unknown,
  groupConditionValue: string
) {
  const existingData = getCachedDatas(cachedDatas);
  return dataReshaper(existingData)
    .addTo(newItem, "items", "groupTitle", groupConditionValue)
    .newShape();
}

const dataCreationTaskTemplateSaved = {
  id: "1f0da0a0-364c-6bfd-9bea-b538946f0c8f",
  name: "testsdfdsfdsfdszz",
  task: {
    id: "1f0d7fda-7fe4-6d11-9092-4b33a18e1890",
    name: "Test dune nouvelle tâche",
    description: "test dune nouvelle tâche",
  },
  degreeConfiguration: {
    id: "1f0d6706-a60d-626c-ad95-fd4a3110da63",
    degreeLevel: "MASTER",
    degreeYear: "2A",
    degreeField: "ADD",
    skills: [
      {
        mainSkillCode: "MAINPO",
        mainSkillId: "1f0d51fa-817a-6969-8d63-d98eece0b59b",
        mainSkillName: "mainpo",
        subSkills: [
          {
            id: "1f0d51fa-3026-6468-8d63-d98eece0b59b",
            code: "SUBPO",
            name: "subpo",
          },
        ],
      },
      {
        mainSkillCode: "MAINSI",
        mainSkillId: "1f0d5153-f7f6-6e63-8d63-d98eece0b59b",
        mainSkillName: "mainsi",
        subSkills: [
          {
            id: "1f0d5152-81f8-6b62-8d63-d98eece0b59b",
            code: "SUBSI",
            name: "subsi",
          },
        ],
      },
    ],
  },
  skills: [
    {
      mainSkill: {
        name: "mainpo",
        code: "MAINPO",
        id: "1f0d51fa-817a-6969-8d63-d98eece0b59b",
      },
      subskills: [
        {
          name: "subpo",
          code: "SUBPO",
          id: "1f0d51fa-3026-6468-8d63-d98eece0b59b",
        },
      ],
    },
    {
      mainSkill: {
        name: "mainsi",
        code: "MAINSI",
        id: "1f0d5153-f7f6-6e63-8d63-d98eece0b59b",
      },
      subskills: [
        {
          name: "subsi",
          code: "SUBSI",
          id: "1f0d5152-81f8-6b62-8d63-d98eece0b59b",
        },
      ],
    },
  ],
};
