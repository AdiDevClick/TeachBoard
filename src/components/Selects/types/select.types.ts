import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ReactNode } from "react";

type LabelledGroupBaseProps<T> = {
  readonly ["0"]: string;
  readonly ["1"]: T[];
};

/**
 * Props for the LabelledGroup component
 *
 * @description This component can be used in two modes:
 * - Direct props mode: pass a tuple with the group name and items array.
 * - ListMapper mode: use SafeListMapperProp to map over items.
 */
export type LabelledGroupProps<T = Record<string, unknown>> = {
  children?: ReactNode;
} & (LabelledGroupBaseProps<T> | SafeListMapperProp<LabelledGroupBaseProps<T>>);
