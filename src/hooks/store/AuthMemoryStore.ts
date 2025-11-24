import type { AuthMemoryState } from "@/hooks/store/types/store.types.ts";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useAuthMemoryStore = create(
  immer(
    combine(
      {
        signupToken: null,
      } as AuthMemoryState,
      (set, get) => ({
        setSignupToken(token: string | null) {
          set((state) => {
            state.signupToken = token;
          });
        },
        clearSignupToken() {
          set((state) => {
            state.signupToken = null;
          });
        },
      })
    )
  )
);
