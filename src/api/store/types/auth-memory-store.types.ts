import type { SessionToken } from "@/api/types/openapi/common.types.ts";

/**
 * In-memory Authentication store.
 *
 * @remark Setters are not needed in the type definition and are managed by Zustand/combine internally
 *
 * @description This store is used to hold temporary authentication data that should not persist across page reloads.
 */
export type AuthMemoryState = {
  signupToken: SessionToken | null;
};
