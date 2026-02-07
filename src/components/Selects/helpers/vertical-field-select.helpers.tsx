import { NonLabelledGroupItemList } from "@/components/Selects/non-labelled-item/exports/non-labelled-item-exports";
import type {
  NonLabelledGroupItemProps,
  PropsWithListings,
} from "@/components/Selects/types/select.types";
import {
  debugLogs,
  withListingsPropsInvalid,
} from "@/configs/app-components.config";
import type { ComponentType } from "react";

/**
 * Higher-Order Component - WithListings
 *
 * Since VerticalFieldSelect is often used to display a list of items, this adds listing capabilities to the component.
 *
 * @description It checks for the validity of the items prop and renders a ListMapper if valid, otherwise it renders the wrapped component without listings.
 *
 * @param Wrapped - The component to wrap with listing capabilities
 * @param items - The list of items to display in the select, passed as a prop to the HOC
 *
 * @returns A new component with listing capabilities
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
