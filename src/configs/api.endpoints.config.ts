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
          id: data.id,
          description: data.task.description,
          value: data.task.name,
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
  if (!cachedDatas) return [];
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
