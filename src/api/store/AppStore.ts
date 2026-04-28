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
  syncValues: {
    shouldSyncEvaluations: true,
    // shouldSyncClasses: false,
    // shouldSyncStudents: false,
  },
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
        combine(DEFAULT_VALUES, (set, get) => {
          const ACTIONS = {
            // SIMPLE STATE UPDATERS
            updateLoggedStatus(isLoggedIn: boolean) {
              const currentUser = get().user;
              set((state) => {
                state.isLoggedIn = currentUser ? isLoggedIn : false;
              });
            },
            shouldResyncEvals() {
              const isSynced = get().sessionSynced;
              const shouldSyncEvaluations =
                get().syncValues.shouldSyncEvaluations;

              return isSynced && shouldSyncEvaluations;
            },
            verifySyncStatus() {
              const sessionSynced = get().sessionSynced;
              const shouldResyncEvals = get().syncValues;

              const isNeedingResync = Object.entries(shouldResyncEvals).some(
                ([key, value]) => {
                  // Any sync value that is true while the session is not synced indicates a need for resync
                  if (value) {
                    console.warn(
                      `Data for "${key}" is marked as needing resync but session is not synced. Current sessionSynced: ${sessionSynced}`,
                    );
                  }
                  return value;
                },
              );

              if (!isNeedingResync) {
                set({ sessionSynced: true });
              }
            },
            setLastUserActivity(
              activity: LastUserActivityType,
              details: LastUserActivityDetails,
            ) {
              const usAct = new UniqueSet() as LastUserActivity;

              const rawLastActivity = get().lastUserActivity;
              const lastActivityEntry =
                rawLastActivity instanceof UniqueSet
                  ? rawLastActivity.values().next().value
                  : null;
              const lastActivityUrl = lastActivityEntry?.url ?? null;

              // verify if the new activity is the same as the last one to avoid redundant updates
              const isSameActivity =
                lastActivityUrl === details.url &&
                lastActivityEntry?.endpoint === details.endpoint;

              if (isSameActivity) {
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
            setShouldResyncEvals(shouldResync: boolean) {
              const currentSyncValue = get().syncValues.shouldSyncEvaluations;

              if (currentSyncValue === shouldResync) {
                return;
              }

              set(
                (state) => {
                  state.syncValues.shouldSyncEvaluations = shouldResync;
                },
                undefined,
                "setShouldResyncEvals",
              );

              ACTIONS.verifySyncStatus();
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
          };
          return ACTIONS;
        }),
      ),
      { name: "app-store" },
    ),
  ),
);
