import { VerticalDrawer } from "@/api/contexts/VerticalDrawer.context";
import type { VerticalDrawerContext } from "@/api/contexts/types/context.types";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import { use } from "react";
import type { FieldValues } from "react-hook-form";

type SelectorKey = string | symbol | number;

/**
 * Custom hook to access the VerticalDrawer context.
 *
 * @important Must be used within a VerticalDrawerProvider to ensure the context is available.
 *
 * @template T - The content type (defaults to AnyObjectProps)
 * @template TFormValues - The form values type (defaults to FieldValues)
 *
 * @param selectors - Optional array of keys to select specific properties from the context. Use `as const` for proper typing.
 * @returns The current value of the VerticalDrawer context or a Pick of selected properties
 *
 * @throws Will throw an error if used outside of a VerticalDrawerProvider.
 *
 * @example
 * // Get the full context with explicit types
 * const context = useVerticalDrawer<MyContentProps, MyFormValues>();
 *
 * // Get specific properties with explicit types (use 'as const' for better inference)
 * const { form, formId } = useVerticalDrawer<MyContentProps, MyFormValues>(["form", "formId"] as const);
 */
export function useVerticalDrawer<
  T extends AnyObjectProps = AnyObjectProps,
  TFormValues extends FieldValues = FieldValues,
>(selectors?: readonly SelectorKey[]): VerticalDrawerContext<T, TFormValues> {
  const context = use(VerticalDrawer);

  if (!context) {
    throw new Error(
      "useVerticalDrawer must be used within a VerticalDrawerProvider",
    );
  }

  // If no selectors provided, return full context
  if (!selectors || selectors.length === 0) {
    return context as unknown as VerticalDrawerContext<T, TFormValues>;
  }

  // Select specific properties
  const selected = {} as Record<SelectorKey, unknown>;

  for (const selector of selectors) {
    selected[selector] = (context as Record<SelectorKey, unknown>)[selector];
  }

  return selected as unknown as VerticalDrawerContext<T, TFormValues>;
}
