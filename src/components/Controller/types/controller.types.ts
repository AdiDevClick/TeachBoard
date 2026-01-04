import type { MetaDatasPopoverField } from "@/components/Popovers/types/popover.types.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types.ts";
import type {
  AnyComponentLike,
  ComponentPropsOf,
} from "@/utils/types/types.utils.ts";
import type { ComponentProps, ComponentPropsWithRef } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppControllerProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T> | UseFormReturn<any>;
};

/**
 * Wrapper props for a controlled component.
 * It provides the `name` and `form` props while forwarding the
 * wrapped component's props, excluding injected props like `field` and `fieldState`.
 */
export type WrapperProps<T extends FieldValues, C> = AppControllerProps<T> &
  Omit<ComponentPropsOf<C>, "field" | "fieldState" | "ref"> &
  Omit<ComponentPropsWithRef<"div">, "onSelect"> & {
    /**
     * Optional callback invoked when a controlled popover/select opens or closes.
     * The optional `meta` is the component's metadata (task, apiEndpoint, etc.).
     */
    onOpenChange?: (open: boolean, meta?: MetaDatasPopoverField) => void;
  } & UseMutationObserverReturn;

/**
 * Same as WrapperProps but with a non-generic form (any),
 * useful for HOC Users where they shouldn't need to specify `T`.
 */

export type WrapperPropsAny<C extends AnyComponentLike = AnyComponentLike> =
  // intentionally accept any form instance type to reduce HOC friction in JSX
  AppControllerProps<any> &
    Omit<ComponentProps<C>, "field" | "fieldState" | "ref"> &
    Omit<ComponentPropsWithRef<"div">, "onSelect"> &
    UseMutationObserverReturn;
