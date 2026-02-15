import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  ListMapperInjectedProps,
  ListMapperOptionalInput,
} from "@/components/Lists/types/ListsTypes.ts";
import type { AnyObjectProps } from "@/utils/types/types.utils.ts";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";

type OptionalInjectedProps<
  P extends object,
  Injected extends object,
  Reserved extends PropertyKey = never,
> = Omit<P, keyof Injected> &
  Partial<Pick<P, Exclude<Extract<keyof P, keyof Injected>, Reserved>>>;

type WithListMapperProps<
  P extends object,
  TItems extends readonly unknown[] | AnyObjectProps,
  TOptionalValue = undefined,
> = {
  items: TItems;
  optional?: ListMapperOptionalInput<TItems, TOptionalValue>;
} & OptionalInjectedProps<
  P,
  ListMapperInjectedProps<TItems, TOptionalValue>,
  "items" | "optional" | "children" | "component"
> & {
    // children?: never;
    component?: never;
  };

function withListMapper<WrappedProps extends object>(
  Wrapped: ComponentType<WrappedProps>,
) {
  function Component<
    TItems extends readonly unknown[] | AnyObjectProps,
    TOptionalValue = undefined,
  >(props: WithListMapperProps<WrappedProps, TItems, TOptionalValue>) {
    const { items, optional, ...rest } = props;

    return (
      <ListMapper items={items} optional={optional}>
        <Wrapped {...(rest as WrappedProps)} />
      </ListMapper>
    );
  }

  createNameForHOC("withListMapper", Wrapped, Component);
  return Component;
}

/**
 * HOC to wrap a component with ListMapper functionality.
 *
 * @example
 *
 * ```tsx
 * const MyListItemWithListMapper = WithListMapper(MyComponentThatNeedsListMapping);
 *
 * How to use:
 * <MyListItemWithListMapper items={myItems} optional={myOptionalProps} otherProp1={} />
 * ```
 */
export default withListMapper;
