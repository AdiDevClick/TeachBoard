import { USER_ACTIVITIES } from "@/configs/app.config.ts";
import type {
  AppStore,
  LastUserActivityType,
  User,
} from "@/hooks/store/types/store.types.ts";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useAppStore = create(
  devtools(
    persist(
      immer(
        combine(
          {
            user: null,
            lastUserActivity: "none",
            sessionSynced: false,
            isLoggedIn: false,
          } as AppStore,
          (set, get) => ({
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
          })
        )
      ),
      { name: "app-store" }
    )
  )
);
