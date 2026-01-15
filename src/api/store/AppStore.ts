import type {
  AppStore,
  LastUserActivityType,
  User,
} from "@/api/store/types/app-store.types";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_VALUES: AppStore = {
  user: null,
  lastUserActivity: "none",
  sessionSynced: false,
  isLoggedIn: false,
};

/**
 * Persisting Application store.
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 */
export const useAppStore = create(
  devtools(
    persist(
      immer(
        combine(DEFAULT_VALUES, (set, get) => ({
          // SIMPLE STATE UPDATERS
          updateLoggedStatus(isLoggedIn: boolean) {
            const currentUser = get().user;
            set((state) => {
              state.isLoggedIn = currentUser ? isLoggedIn : false;
            });
          },
          setLastUserActivity(activity: LastUserActivityType) {
            set((state) => {
              state.lastUserActivity = activity;
            });
          },
          // CRITICAL STATE MODIFIERS // CASCADING
          clearUser() {
            set((state) => {
              state.user = null;
            });
          },
          signup() {
            set((state) => {
              state.lastUserActivity = USER_ACTIVITIES.signup;
              state.isLoggedIn = false;
            });
          },
          signupValidation() {
            set((state) => {
              state.lastUserActivity = USER_ACTIVITIES.signupValidation;
              state.isLoggedIn = false;
            });
          },
          passwordCreation() {
            set((state) => {
              state.lastUserActivity = USER_ACTIVITIES.passwordCreation;
              state.isLoggedIn = false;
            });
          },
          login(user: User) {
            set((state) => {
              state.lastUserActivity = USER_ACTIVITIES.login;
              state.isLoggedIn = true;
              state.user = user;
            });
          },
          logout() {
            set((state) => {
              state.user = null;
              state.isLoggedIn = false;
              state.sessionSynced = false;
              state.lastUserActivity = "logout";
            });
          },
          clearUserStateOnError() {
            set((state) => {
              state.user = null;
              state.isLoggedIn = false;
              state.sessionSynced = false;
            });
          },
          updateSession(isSynced: boolean, activity: LastUserActivityType) {
            const currentUser = get().user;
            set((state) => {
              state.lastUserActivity = activity;
              state.sessionSynced = currentUser ? isSynced : false;
            });
          },
        }))
      ),
      { name: "app-store" }
    )
  )
);
