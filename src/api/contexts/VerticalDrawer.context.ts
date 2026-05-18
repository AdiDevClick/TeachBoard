import type { VerticalDrawerContext } from "@/api/contexts/types/context.types";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import type { FieldValues } from "react-hook-form";
import { createContext } from "react";

/**
 * Context for managing the state of the VerticalDrawer component.
 */
export const VerticalDrawer = createContext<
  VerticalDrawerContext<AnyObjectProps, FieldValues>
>(
  null!,
);
