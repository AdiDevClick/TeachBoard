const BASE_API_URL = "/api";

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  GET: {
    METHOD: "GET",
    CLASSES: {
      ALL: `${BASE_API_URL}/classes/`,
      BY_ID: (id: number | string) => `${BASE_API_URL}/classes/${id}`,
    },
    STUDENTS: `${BASE_API_URL}/students`,
    COURSES: `${BASE_API_URL}/courses`,
    USERS: `${BASE_API_URL}/users`,
    POSTS: `${BASE_API_URL}/posts`,
  },
  POST: {
    METHOD: "POST",
    CREATE_CLASS: `${BASE_API_URL}/classes/create`,
    AUTH: {
      LOGIN: `${BASE_API_URL}/auth/login`,
      REGISTER: `${BASE_API_URL}/auth/register`,
      SESSION_CHECK: `${BASE_API_URL}/auth/session`,
    },
  },
};
