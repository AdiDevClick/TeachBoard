/**
 * App Configuration
 *
 * @description This file contains global configuration settings for the application.
 */

/** Preferred language for the application */
export const LANGUAGE = "fr-FR";

/** Check if the app is running in development mode */
export const DEV_MODE = import.meta.env.DEV;

/** Supported HTTP methods for API requests */
export const HTTP_METHODS = [
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
  | "create-diploma";

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
// export const NO_SESSIONS_PAGES = ["/login", "/signup", "/signup/validate"];
