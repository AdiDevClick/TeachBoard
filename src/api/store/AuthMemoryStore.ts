import type { AuthMemoryState } from "@/api/store/types/auth-memory-store.types.ts";
import { create } from "zustand";
import { combine } from "zustand/middleware";
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
  immer(
    combine(DEFAULT_VALUES, (set) => ({
      setSignupToken(token: AuthMemoryState["signupToken"]) {
        set((state) => {
          state.signupToken = token;
        });
      },
      clearSignupToken() {
        set(() => ({ ...DEFAULT_VALUES }));
      },
    }))
  )
);
