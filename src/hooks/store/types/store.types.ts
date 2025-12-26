import type { USER_ACTIVITIES } from "@/configs/app.config.ts";

export interface User {
  userId: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role: string;
  token: string;
  avatar: string;
  refreshToken: string;
  schoolName: string;
}

// export interface UserDisplayData {
//   avatar: string;
//   name: string;
//   email: string;
// }

export type LastUserActivityType =
  (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES];

/**
 * Persisting Application store.
 */
export interface AppStore {
  lastUserActivity: LastUserActivityType;
  isLoggedIn: boolean;
  user: User | null;
  sessionSynced: boolean;
  // Setters are not needed in the type definition and are managed by Zustand/combine internally
}

/**
 * In-memory Authentication store.
 *
 * @description This store is used to hold temporary authentication data that should not persist across page reloads.
 */
export type AuthMemoryState = {
  signupToken: string | null;
  // Setters are not needed in the type definition and are managed by Zustand/combine internally
};
