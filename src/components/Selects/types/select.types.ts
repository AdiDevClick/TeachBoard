import type { VerticalFieldSelect } from "@/components/Selects/VerticalFieldSelect.tsx";
import type { Select, SelectContent } from "@/components/ui/select.tsx";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ComponentProps, PropsWithChildren, ReactNode } from "react";

/**
 * Props for the VerticalFieldSelect component
 * {@link VerticalFieldSelect}
 */
export type VerticalSelectProps = ComponentProps<typeof Select> & {
  label?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  side?: ComponentProps<typeof SelectContent>["side"];
} & PropsWithChildren;

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
export type LabelledGroupProps<T = Record<string, unknown>> =
  PropsWithChildren &
    (LabelledGroupBaseProps<T> | SafeListMapperProp<LabelledGroupBaseProps<T>>);
