import type {
  AppStore,
  LastUserActivity,
  LastUserActivityDetails,
  LastUserActivityType,
  User,
} from "@/api/store/types/app-store.types";
import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import { UniqueSet } from "@/utils/UniqueSet";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_VALUES: AppStore = {
  user: null,
  lastUserActivity: new UniqueSet(),
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
          setLastUserActivity(
            activity: LastUserActivityType,
            details: LastUserActivityDetails,
          ) {
            const usAct = new UniqueSet() as LastUserActivity;

            const rawLastActivity = get().lastUserActivity;
            const lastActivityUrl =
              rawLastActivity instanceof UniqueSet
                ? rawLastActivity.values().next().value?.url
                : null;

            if (lastActivityUrl === details.url) {
              return;
            }

            set((state) => {
              state.lastUserActivity = usAct.set(activity, {
                ...details,
                previousUrl: lastActivityUrl ?? "none",
              });
            });
          },
          // CRITICAL STATE MODIFIERS // CASCADING
          clearUser() {
            set((state) => {
              state.user = null;
            });
          },
          signup() {
            const usAct = new UniqueSet() as LastUserActivity;

            set((state) => {
              const lastActivity = state.lastUserActivity?.values().next()
                .value?.previousUrl;

              state.lastUserActivity = usAct.set(USER_ACTIVITIES.signup, {
                url: "/signup",
                previousUrl: lastActivity,
              });

              state.isLoggedIn = false;
            });
          },
          signupValidation() {
            const usAct = new UniqueSet() as LastUserActivity;

            set((state) => {
              const lastActivity = state.lastUserActivity?.values().next()
                .value?.previousUrl;

              state.lastUserActivity = usAct.set(
                USER_ACTIVITIES.signupValidation,
                {
                  url: "/signup-validation",
                  previousUrl: lastActivity,
                },
              );

              state.isLoggedIn = false;
            });
          },
          passwordCreation() {
            const usAct = new UniqueSet() as LastUserActivity;

            set((state) => {
              const lastActivity = state.lastUserActivity?.values().next()
                .value?.previousUrl;

              state.lastUserActivity = usAct.set(
                USER_ACTIVITIES.passwordCreation,
                {
                  url: "/password-creation",
                  previousUrl: lastActivity,
                },
              );

              state.isLoggedIn = false;
            });
          },
          login(user: User) {
            const usAct = new UniqueSet() as LastUserActivity;
            set((state) => {
              const lastActivity = state.lastUserActivity?.values().next()
                .value?.previousUrl;

              state.lastUserActivity = usAct.set(USER_ACTIVITIES.login, {
                url: "/login",
                previousUrl: lastActivity,
              });

              state.isLoggedIn = true;
              state.user = user;
            });
          },
          logout() {
            const usAct = new UniqueSet() as LastUserActivity;

            set((state) => {
              const lastActivity = state.lastUserActivity?.values().next()
                .value?.previousUrl;

              state.user = null;
              state.isLoggedIn = false;
              state.sessionSynced = false;

              state.lastUserActivity = usAct.set(USER_ACTIVITIES.logout, {
                url: "/logout",
                previousUrl: lastActivity,
              });
            });
          },
          clearUserStateOnError() {
            set((state) => {
              state.user = null;
              state.isLoggedIn = false;
              state.sessionSynced = false;
            });
          },
          updateSession(
            isSynced: boolean,
            activity: LastUserActivityType,
            details: LastUserActivityDetails,
          ) {
            const currentUser = get().user;
            const usAct = new UniqueSet() as LastUserActivity;

            set((state) => {
              const lastActivity = state.lastUserActivity?.values().next()
                .value?.previousUrl;

              state.lastUserActivity = usAct.set(activity, {
                ...details,
                previousUrl: lastActivity,
              });

              state.sessionSynced = currentUser ? isSynced : false;
            });
          },
        })),
      ),
      { name: "app-store" },
    ),
  ),
);
