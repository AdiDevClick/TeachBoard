import type {
  Email,
  SessionToken,
  UUID,
} from "@/api/types/openapi/common.types.ts";
import type { USER_ACTIVITIES } from "@/configs/app.config.ts";
export type AppRoles = "ADMIN" | "TEACHER" | "STUDENT" | "STAFF";

/**
 * User information stored in the application store.
 */
export interface User {
  userId: UUID;
  name: string;
  email: Email;
  firstName?: string;
  lastName?: string;
  username?: string;
  role: AppRoles;
  token: SessionToken;
  avatar: string;
  refreshToken: SessionToken;
  schoolName: string;
}

// export interface UserDisplayData {
//   avatar: string;
//   name: string;
//   email: string;
// }

/**
 * Type representing the last user activity in the application.
 */
export type LastUserActivityType =
  (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES];

/**
 * Persisting Application store.
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 */
export interface AppStore {
  lastUserActivity: LastUserActivityType;
  isLoggedIn: boolean;
  user: User | null;
  sessionSynced: boolean;
}

/**
 * In-memory Authentication store.
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 *
 * @description This store is used to hold temporary authentication data that should not persist across page reloads.
 */
export type AuthMemoryState = {
  signupToken: SessionToken | null;
};
