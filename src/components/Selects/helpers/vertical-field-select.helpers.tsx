import { ListMapper } from "@/components/Lists/ListMapper";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem";
import type {
  ForControllerVerticalFieldSelectProps,
  PropsWithListings,
} from "@/components/Selects/types/select.types";
import {
  debugLogs,
  listMapperContainsInvalid,
} from "@/configs/app-components.config";
import type { ComponentType } from "react";

/**
 * Higher-Order Component - ForController
 *
 * It checks for the validity of the controller props and renders the wrapped component with the appropriate field and fieldState props.
 *
 * @remark !! IMPORTANT !! This HOC is designed to work specifically with VerticalFieldSelect and its variations.
 * It is not a generic withController HOC and may not work correctly with other components without modification.
 *
 * If you believe this HOC can be generalized, consider moving it to the HOC's folder and ensuring it is designed to handle a wider range of components and prop types.
 *
 * @param Wrapped - The component to be wrapped with the Controller functionality.
 */
export function ForController<P>(WrapperComponent: ComponentType<P>) {
  return function Component(props: P & ForControllerVerticalFieldSelectProps) {
    const { field, fieldState, ...rest } = props;
    const { onValueChange, ...restProps } = rest;

    const handleValueChange = (value: string, ...args: unknown[]) => {
      field.onChange(value);
      onValueChange?.(value, ...args);
    };

    return (
      <WrapperComponent
        {...(restProps as P)}
        value={field.value ?? ""}
        onValueChange={handleValueChange}
        aria-invalid={fieldState.invalid}
      />
    );
  };
}

/**
 * Higher-Order Component - WithListings
 *
 * Since VerticalFieldSelect is often used to display a list of items, this adds listing capabilities to the component.
 *
 * @description It checks for the validity of the items prop and renders a ListMapper if valid, otherwise it renders the wrapped component without listings.
 *
 * @param Wrapped
 * @returns
 */
export function WithListings<C extends object>(Wrapped: ComponentType<C>) {
  return function Component(props: C & PropsWithListings<unknown>) {
    if (listMapperContainsInvalid(props)) {
      debugLogs("withListings for VerticalFieldSelect");
      const { children, ...rest } = props;

      return <Wrapped {...(rest as C)}>{children}</Wrapped>;
    }
    const { items, children, ...rest } = props;
    return (
      <Wrapped {...(rest as C)}>
        <ListMapper items={items}>
          <NonLabelledGroupItem />
        </ListMapper>
        {children}
      </Wrapped>
    );
  };
}
