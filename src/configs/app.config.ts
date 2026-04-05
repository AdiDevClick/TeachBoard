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
export const NO_QUERY_LOGS = true;
/**
 * Disable component props validation warnings in the console.
 */
export const NO_COMPONENT_PROPS_WARNING_LOGS = false;
/**
 * Disable component handler warnings in the console.
 */
export const NO_COMPONENT_HANDLER_WARNING_LOGS = true;
/**
 * Disable animation logs in the console.
 */
export const NO_ANIMATIONS_LOGS = true;

export const ANIMATIONS_LOGS = false;
export const NO_SESSION_CHECK_LOGS = true;

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
  evaluationClassSelection: "evaluation-class-selection",
  classCreation: "class-creation",
  signup: "signup",
  signupValidation: "signup-validation",
  passwordCreation: "password-creation",
  fetchDiplomas: "fetch-diplomas",
  fetchModulesSkills: "fetch-modules-skills",
  degreeCreation: "degree-creation",
  degreeModuleCreation: "degree-module-creation",
  degreeModuleSkillCreation: "new-degree-module-skill",
  evaluationOverview: "evaluation-overview",
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
  | "class-name-availability"
  | "create-diploma"
  | "new-degree-item-field"
  | "new-degree-item-year"
  | "new-degree-item-level"
  | "new-degree-module"
  | "new-degree-module-skill"
  | "new-task-template"
  | "new-task-item"
  // Used by TaskTemplateCreationController in the input - Not an actual modal
  | "new-task-module"
  // Used by ClassCreationController in the input - Not an actual modal
  | "add-school-year"
  | "search-students"
  | "search-primaryteacher"
  | "evaluation-class-selection"
  | "evaluation-attendance"
  | "evaluation-module-selection"
  | "evaluation-summary"
  | "evaluation-overview"
  | "availability";

/**
 * Pages that do not require session checks
 *
 * @description List of routes where session checks are bypassed.
 */
const NO_SESSIONS_CHECK_PAGES = [
  "/",
  "/login",
  "/logout",
  "/signup",
  "/error",
  "/password-creation",
  "/forgot-password",
] as const;

/**
 * Check if the given path is in the list of pages that do not require session checks.
 *
 * @param path - The current path to check against the no-session-check list.
 * @returns - True if the path is in the no-session-check list, false otherwise.
 */
export const doesContainNoSessionPage = (path: string) => {
  return NO_SESSIONS_CHECK_PAGES.some((page) => {
    if (page === "/" && path === "/") {
      return true;
    }

    if (page !== "/") return path.startsWith(page);
  });
};

const REDIRECT_AFTER_LOGIN_PAGES_LIST = [
  "/login",
  "/signup",
  "/logout",
] as const;

/**
 * Check if the given path is in the list of pages that should trigger a redirect after login.
 *
 * @param path - The current path to check against the redirect list.
 * @returns - True if the path is in the redirect list, false otherwise.
 */
export const ifThisPageIsInRedirectList = (path: string) => {
  return REDIRECT_AFTER_LOGIN_PAGES_LIST.some(
    (page) => page === path || path.startsWith(page),
  );
};

const DO_NOT_FORCE_REDIRECT_IF_ACTIONS_ARE = [
  USER_ACTIVITIES.sessionCheck,
] as const;

/**
 * Determine if a redirection should be forced based on the user activity.
 *
 * @description Used by the useFetch hook to decide whether to navigate to the login page on a 403 Forbidden error, depending on the user activity that triggered the fetch.
 *
 * @param action - The user activity to check against the list of actions that do not require redirection.
 *
 * @returns - True if a redirection should be forced, false otherwise.
 *
 * @example For instance, if the user activity is a session check, we do not want to force a redirection to the login page on a 403 error, as this could create a loop of failed session checks and redirections.
 * In contrast, for other activities like fetching data for a protected resource, we would want to redirect the user to the login page if they are not properly authenticated.
 */
export const forceRedirectionIfNeeded = (action: string) => {
  return DO_NOT_FORCE_REDIRECT_IF_ACTIONS_ARE.every(
    (excludedAction) => excludedAction !== action,
  );
};

export const APP_REDIRECT_TIMEOUT = 1500;
export const APP_REDIRECT_TIMEOUT_SUCCESS = 500;
