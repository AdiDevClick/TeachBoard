import type { VerticalDrawerContext } from "@/api/contexts/types/context.types";
import type { PropsWithChildren } from "react";

/**
 * Provider component for the VerticalDrawer context
 */
export type VerticalDrawerProviderProps = {
  value: VerticalDrawerContext;
} & PropsWithChildren;
