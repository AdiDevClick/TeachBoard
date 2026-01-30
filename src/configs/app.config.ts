/**
 * App Configuration
 *
 * @description This file contains global configuration settings for the application.
 */

import { mirrorProperties } from "@/utils/utils.ts";

/** Preferred language for the application */
export const LANGUAGE = "fr-FR";

/** Check if the app is running in development mode */
export const DEV_MODE = import.meta.env.DEV;
export const NO_PROXY_LOGS = true;
export const NO_MUTATION_OBSERVER_LOGS = true;
export const NO_CACHE_LOGS = true;
export const NO_QUERY_LOGS = false;
export const NO_COMPONENT_WARNING_LOGS = false;
export const ANIMATIONS_LOGS = false;

const HTTP_METHODS_LIST = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
  "CONNECT",
  "TRACE",
] as const;

/** Supported HTTP methods for API requests */
export const HTTP_METHODS = mirrorProperties(HTTP_METHODS_LIST) as {
  [key in (typeof HTTP_METHODS_LIST)[number]]: key;
};

/**
 * User activities constants
 * @description These constants represent different user activities within the application.
 */
export const USER_ACTIVITIES = Object.freeze({
  login: "login",
  logout: "logout",
  none: "none",
  sessionCheck: "session-check",
  classes: "classes",
  classCreation: "class-creation",
  signup: "signup",
  signupValidation: "signup-validation",
  passwordCreation: "password-creation",
  fetchDiplomas: "fetch-diplomas",
  fetchModulesSkills: "fetch-modules-skills",
  degreeCreation: "degree-creation",
  degreeModuleCreation: "degree-module-creation",
  degreeModuleSkillCreation: "new-degree-module-skill",
});

/**
 * App modal names
 *
 * @description Defines the names of modals used in the application.
 */
export type AppModalNames =
  | "login"
  | "apple-login"
  | "none"
  | "signup"
  | "pw-recovery"
  | "pw-recovery-email-sent"
  | "class-creation"
  | "create-diploma"
  | "new-degree-item-field"
  | "new-degree-item-year"
  | "new-degree-item-degree"
  | "new-degree-module"
  | "new-degree-module-skill"
  | "new-task-template"
  | "new-task-item"
  // Used by TaskTemplateCreationController in the input - Not an actual modal
  | "new-task-skill"
  // Used by ClassCreationController in the input - Not an actual modal
  | "add-school-year"
  | "search-students"
  | "search-primaryteacher"
  | "attendance-record-creation"
  | "evaluation-step-one"
  | "evaluation-summary";

/**
 * Pages that do not require session checks
 *
 * @description List of routes where session checks are bypassed.
 */
export const NO_SESSIONS_CHECK_PAGES = [
  "/login",
  "/signup",
  "/error",
  "/password-creation",
  "/forgot-password",
];

export const APP_REDIRECT_TIMEOUT = 1500;
export const APP_REDIRECT_TIMEOUT_SUCCESS = 500;
