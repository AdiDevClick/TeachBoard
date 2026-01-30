import type { AuthMemoryState } from "@/api/store/types/auth-memory-store.types.ts";
import { DEV_MODE } from "@/configs/app.config.ts";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_VALUES: AuthMemoryState = {
  signupToken: null,
};

/**
 * In-memory Authentication store.
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 */
export const useAuthMemoryStore = create(
  devtools(
    immer(
      combine(DEFAULT_VALUES, (set) => ({
        setSignupToken(token: AuthMemoryState["signupToken"]) {
          set(
            (state) => {
              state.signupToken = token;
            },
            undefined,
            "setSignupToken",
          );
        },
        clearSignupToken() {
          set(() => ({ ...DEFAULT_VALUES }), undefined, "clearSignupToken");
        },
      })),
    ),
    {
      serialize: { options: { map: true, set: true } },
      enabled: DEV_MODE,
      predicate: (_state, action) =>
        !/^authMemory\/debug\/rehydrateCollections$/.test(action?.type ?? ""),
      store: "authMemory",
    },
  ),
);
