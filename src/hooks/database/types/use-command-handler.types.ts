import type { useForm } from "react-hook-form";

/**
 * Parameters for the useCommandHandler hook
 */
export interface UseCommandHandlerParams {
  /** Zod validated form instance */
  form: ReturnType<typeof useForm>;
  /** Identifier for the current page/module */
  pageId: string;
}
