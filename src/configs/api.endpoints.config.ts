const BASE_API_URL = "/api";
const API_VERSION = "v1";

//

const AUTH = `${BASE_API_URL}/auth`;
const DEGREES = `${BASE_API_URL}/degrees`;

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = Object.freeze({
  GET: {
    METHOD: "GET",
    CLASSES: {
      ALL: `${BASE_API_URL}/classes/`,
      BY_ID: (id: number | string) => `${BASE_API_URL}/classes/${id}`,
    },
    DEGREES: DEGREES,
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
  },
} as const);
