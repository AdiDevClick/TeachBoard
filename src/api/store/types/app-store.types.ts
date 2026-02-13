import type {
  Email,
  SessionToken,
  UUID,
} from "@/api/types/openapi/common.types.ts";
import type { USER_ACTIVITIES } from "@/configs/app.config.ts";
import type { UniqueSet } from "@/utils/UniqueSet";
import type { FormMethod } from "react-router-dom";
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

export type LastUserActivity = UniqueSet<
  LastUserActivityType,
  LastUserActivityDetails
>;
export type LastUserActivityDetails = {
  url: string;
  previousUrl?: string;
  endpoint?: string;
  method?: FormMethod;
  type?: string;
};
/**
 * Persisting Application store.
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 */
export interface AppStore {
  lastUserActivity: LastUserActivity;
  isLoggedIn: boolean;
  user: User | null;
  sessionSynced: boolean;
}
