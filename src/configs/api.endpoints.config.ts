import { ObjectReshape } from "@/utils/ObjectReshape.ts";

const BASE_API_URL = "/api";
const API_VERSION = "v1";

//

const AUTH = `${BASE_API_URL}/auth`;
const DEGREES = `${BASE_API_URL}/degrees`;
const SKILLS = `${BASE_API_URL}/skills`;

/**
 * API Endpoints Configuration
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
        // use "code" and transform to "value" for selects
        // data.Skills is the actual array of skills from the server response
        dataReshaper(data)
          .rename("Skills", "items")
          .add({ groupTitle: "Tous" })
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
        // use "name" and transform to "value" for selects
        dataReshaper(data)
          .assignSourceTo("items")
          .add({ groupTitle: "Tous" })
          .assign([["name", "value"]])
          .newShape(),
    },
    DIPLOMAS: `${DEGREES}/config`,
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
          id: degree?.id,
          value: degree?.name,
        };

        const existingData = getCachedDatas(cachedDatas);

        return [{ ...existingData, items: [...existingData.items, newItem] }];
      },
    },
    CREATE_SKILL: {
      endPoints: { MODULE: `${SKILLS}/main`, SUBSKILL: `${SKILLS}/sub` },
      dataReshape: (data: any, cachedDatas) => {
        const existingData = getCachedDatas(cachedDatas);

        // Mapping code -> value
        const newItem = {
          ...data,
          value: data.code,
        };

        return [
          {
            ...existingData,
            items: [...existingData.items, newItem],
          },
        ];
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
  const firstItem = data?.[0];
  return firstItem || { items: [] };
}
