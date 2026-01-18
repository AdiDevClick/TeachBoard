import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { ListMapperProps } from "@/components/Lists/types/ListsTypes.ts";
import type {
  AnyComponentLike,
  ExtractItemType,
  MissingRequiredProps,
} from "@/utils/types/types.utils.ts";
import type { ComponentProps, ComponentType } from "react";

type KeysOfUnion<T> = T extends unknown ? keyof T : never;
type ProvidedKeyRecord<T> = Record<KeysOfUnion<T>, unknown>;
type ReservedListMapperKeys = "items" | "optional" | "children";

type PropsType<
  Items,
  TOptional extends Record<string, unknown> | undefined,
  P,
> = Readonly<
  Pick<
    ListMapperProps<Items, ComponentType<P>, TOptional>,
    ReservedListMapperKeys
  > &
    Omit<P, KeysOfUnion<ExtractItemType<Items>> | "children"> &
    Partial<
      Pick<
        P,
        Extract<
          Exclude<KeysOfUnion<ExtractItemType<Items>>, ReservedListMapperKeys>,
          keyof P
        >
      >
    > &
    MissingRequiredProps<P, ProvidedKeyRecord<ExtractItemType<Items>>>
>;

function withListMapper<C extends AnyComponentLike>(Wrapped: C) {
  return function Component<
    Items extends readonly unknown[] | Record<string, unknown>,
    TOptional extends Record<string, unknown> | undefined,
    P extends ComponentProps<C> = ComponentProps<C>,
  >(props: PropsType<Items, TOptional, P>) {
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
