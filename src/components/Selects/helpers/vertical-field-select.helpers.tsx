import type { UUID } from "@/api/types/openapi/common.types";
import { NonLabelledGroupItemList } from "@/components/Selects/non-labelled-item/exports/non-labelled-item-exports";
import type {
  ForControllerVerticalFieldSelectProps,
  NonLabelledGroupItemProps,
  PropsWithListings,
  VerticalSelectMetaData,
} from "@/components/Selects/types/select.types";
import {
  debugLogs,
  withListingsPropsInvalid,
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

    const handleValueChange = (value: UUID, meta?: VerticalSelectMetaData) => {
      field.onChange(value);
      onValueChange?.(value, meta);
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
  return function Component(
    props: C & PropsWithListings<NonLabelledGroupItemProps>,
  ) {
    if (withListingsPropsInvalid(props)) {
      debugLogs(
        "[WithListings for VerticalFieldSelect] - invalid items provided",
        {
          items: props.items,
        },
      );

      return <Wrapped {...(props as C)}>{props.children}</Wrapped>;
    }

    const { items, children, ...rest } = props;

    return (
      <Wrapped {...(rest as C)}>
        <NonLabelledGroupItemList items={items} />
        {children}
      </Wrapped>
    );
  };
}
