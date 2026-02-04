import type { MetaDatasPopoverField } from "@/components/Popovers/types/popover.types.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types.ts";
import type {
  AnyComponentLike,
  ComponentPropsOf,
  OwnProps,
  RequiredKeys,
} from "@/utils/types/types.utils.ts";
import type { ComponentPropsWithRef } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppControllerProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
};

/**
 * Same as WrapperProps but with a non-generic form (any),
 * useful for HOC Users where they shouldn't need to specify `T`.
 */

export type WrapperPropsAny<C extends AnyComponentLike = AnyComponentLike> =
  // intentionally accept any form instance type to reduce HOC friction in JSX
  AppControllerProps<any> &
    Omit<ComponentPropsOf<C>, "field" | "fieldState" | "ref" | "form"> &
    RequiredWrappedProps<C> &
    Omit<ComponentPropsWithRef<"div">, "onSelect"> &
    UseMutationObserverReturn;

type RequiredWrappedProps<C extends AnyComponentLike> = Pick<
  OwnProps<ComponentPropsOf<C>>,
  Exclude<
    RequiredKeys<OwnProps<ComponentPropsOf<C>>>,
    "field" | "fieldState" | "controllerMeta"
  >
>;
