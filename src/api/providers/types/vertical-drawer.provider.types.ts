import type { VerticalDrawerContext } from "@/api/contexts/types/context.types";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import type { PropsWithChildren } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * Provider component for the VerticalDrawer context
 */
export type VerticalDrawerProviderProps<
  T extends AnyObjectProps = AnyObjectProps,
  TFormValues extends FieldValues = FieldValues,
> = {
  value: VerticalDrawerContext<T, TFormValues>;
} & PropsWithChildren;
