import { VerticalDrawer } from "@/api/contexts/VerticalDrawer.context";
import type { VerticalDrawerProviderProps } from "@/api/providers/types/vertical-drawer.provider.types";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import type { Context } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * Provider component for the VerticalDrawer context.
 *
 * @param value The value to be provided to the VerticalDrawer context.
 * @param children The child components that will have access to the VerticalDrawer context.
 */
export function VerticalDrawerProvider<
  T extends AnyObjectProps,
  TFormValues extends FieldValues,
>({ value, children }: VerticalDrawerProviderProps<T, TFormValues>) {
  return (
    <VerticalDrawer.Provider
      value={
        value as typeof VerticalDrawer extends Context<infer V> ? V : never
      }
    >
      {children}
    </VerticalDrawer.Provider>
  );
}
