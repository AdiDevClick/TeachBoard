import type { USER_ACTIVITIES } from "@/configs/app.config.ts";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar: string;
  refreshToken: string;
}

// export interface UserDisplayData {
//   avatar: string;
//   name: string;
//   email: string;
// }

export type LastUserActivityType =
  (typeof USER_ACTIVITIES)[keyof typeof USER_ACTIVITIES];

export interface AppStore {
  lastUserActivity: LastUserActivityType;
  isLoggedIn: boolean;
  user: User | null;
  sessionSynced: boolean;
  // Setters are not needed in the type definition and are managed by Zustand/combine internally
}
