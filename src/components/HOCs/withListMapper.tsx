import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { ListMapperProps } from "@/components/Lists/types/ListsTypes.ts";
import type {
  AnyComponentLike,
  ComponentPropsOf,
  ExtractItemType,
  MissingRequiredProps,
} from "@/utils/types/types.utils.ts";
import type { ComponentType } from "react";

function withListMapper<C extends AnyComponentLike>(Wrapped: C) {
  return function Component<
    Items extends readonly unknown[] | Record<string, unknown>,
    TOptional extends Record<string, unknown> | undefined,
    P extends ComponentPropsOf<C> = ComponentPropsOf<C>
  >(
    props: Readonly<
      Pick<
        ListMapperProps<Items, ComponentType<P>, TOptional>,
        "items" | "optional" | "children"
      > &
        Omit<P, keyof ExtractItemType<Items> | "children"> &
        Partial<Pick<P, Extract<keyof ExtractItemType<Items>, keyof P>>> &
        MissingRequiredProps<P, ExtractItemType<Items>>
    >
  ) {
    const { items, optional, ...rest } = props;

    return (
      <ListMapper items={items} optional={optional}>
        <Wrapped {...(rest as P)} />
      </ListMapper>
    );
  };
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
