import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type {
  ListMapperInjectedProps,
  ListMapperOptionalInput,
  ListMapperOptionalValue,
} from "@/components/Lists/types/ListsTypes.ts";
import type {
  AnyComponentLike,
  AnyObjectProps,
  MissingRequiredProps,
} from "@/utils/types/types.utils.ts";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentProps, ReactElement, ReactNode } from "react";

type PropsWithOptional<
  Items,
  C extends AnyComponentLike,
  TOptional extends AnyObjectProps,
> = PropsTypeBase<Items, C> & {
  optional: ListMapperOptionalInput<Items, TOptional>;
} & MissingRequiredProps<
    ComponentProps<C>,
    ListMapperInjectedProps<Items, ListMapperOptionalValue<TOptional>>
  >;

type PropsWithoutOptional<Items, C extends AnyComponentLike> = PropsTypeBase<
  Items,
  C
> &
  ({
    optional?: never;
  } & MissingRequiredProps<
    ComponentProps<C>,
    ListMapperInjectedProps<Items, undefined>
  >);

type PropsType<
  Items,
  C extends AnyComponentLike,
  TOptional extends AnyObjectProps,
> = PropsWithOptional<Items, C, TOptional> | PropsWithoutOptional<Items, C>;

type PropsTypeBase<Items, C extends AnyComponentLike> = Readonly<
  {
    items: Items;
    children?: ReactNode;
  } & Partial<Omit<ComponentProps<C>, "items">>
>;
type WithListMapperComponent<C extends AnyComponentLike> = <
  Items extends readonly unknown[] | AnyObjectProps,
  TOptional extends AnyObjectProps = AnyObjectProps,
>(
  props: PropsType<Items, C, TOptional>,
) => ReactElement | null;

function withListMapper<C extends AnyComponentLike>(Wrapped: C) {
  // function withListMapper<C extends AnyComponentLike>(
  //   Wrapped: C,
  // ): WithListMapperComponent<C> {
  function Component<
    Items extends readonly unknown[] | AnyObjectProps,
    TOptional extends AnyObjectProps = AnyObjectProps,
  >(props: PropsType<Items, C, TOptional>) {
    const { items, optional, ...rest } = props;

    return (
      <ListMapper items={items} optional={optional}>
        <Wrapped {...(rest as ComponentProps<C>)} />
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
