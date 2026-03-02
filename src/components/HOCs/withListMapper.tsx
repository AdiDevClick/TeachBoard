import { ListMapper } from "@/components/Lists/ListMapper";
import type {
  ListMapperItem,
  ListMapperOptionalInput,
  ListMapperOptionalValue,
} from "@/components/Lists/types/ListsTypes";
import type {
  AnyObjectProps,
  MergeProvided,
  RemoveStringIndex,
} from "@/utils/types/types.utils";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType, ReactElement } from "react";

type TBaseProps<TProps extends object> = RemoveStringIndex<TProps>;

type OmittedByMerge<TProps extends object, TItem, TOptionalValue> = Omit<
  TBaseProps<TProps>,
  keyof RemoveStringIndex<MergeProvided<TItem, TOptionalValue>>
>;

type MergeAllRemainingProps<
  T extends object,
  TItems,
  TOptionalInput,
> = OmittedByMerge<
  T,
  ListMapperItem<TItems>,
  NoInfer<ListMapperOptionalValue<TOptionalInput>>
>;

/**
 * Constrains items-array element types so TypeScript applies excess-property
 * checking to inline object literals while keeping structural compatibility for
 * variable references.
 */
type ConstrainedItems<
  T extends object,
  TItems,
> = TItems extends readonly (infer TItem)[]
  ? TItem extends readonly unknown[]
    ? TItems // tuple items — no extra-props constraint
    : readonly Partial<RemoveStringIndex<T>>[] // plain-object items — contextual type for excess-prop check
  : TItems; // record / object TItems — pass through

/**
 * First leg of the intersection that forms {@link WithListMapperComponent}.
 *
 * This signature handles the **function** form of `optional` exclusively.
 * {@link WithListMapperOriginalSig} for that role.
 */
type WithListMapperFuncOptionalSig<T extends object> = <
  TItems extends AnyObjectProps | readonly unknown[],
  TOptionalFn,
>(
  props: {
    items: TItems & ConstrainedItems<T, TItems>;
    optional: TOptionalFn &
      ((
        item: ListMapperItem<TItems>,
        index: number,
      ) => Partial<RemoveStringIndex<T>>);
  } & OmittedByMerge<
    T,
    ListMapperItem<TItems>,
    TOptionalFn extends (...args: never[]) => infer R ? R : never
  >,
) => ReactElement | null;

/**
 * Second (last) leg of the intersection that forms {@link WithListMapperComponent}.
 *
 * This is the *canonical* call signature — equivalent to the pre-intersection
 * single signature.
 */
type WithListMapperOriginalSig<T extends object> = <
  TItems extends AnyObjectProps | readonly unknown[],
  TOptionalInput = undefined,
>(
  props: {
    items: TItems & ConstrainedItems<T, TItems>;
    optional?: ListMapperOptionalInput<TItems, TOptionalInput>;
  } & MergeAllRemainingProps<T, TItems, TOptionalInput>,
) => ReactElement | null;

/**
 * Component type produced by `withListMapper`.
 *
 * This is a **function-intersection** type (not an object-literal overload)
 */
type WithListMapperComponent<T extends object> =
  WithListMapperFuncOptionalSig<T> & WithListMapperOriginalSig<T>;

/**
 * Internal props type used by the Component implementation at runtime.
 */
type WithListMapperImplProps<
  T extends object,
  TItems extends AnyObjectProps | readonly unknown[],
  TOptionalInput = undefined,
> = {
  items: ConstrainedItems<T, TItems>;
  optional?: ListMapperOptionalInput<TItems, TOptionalInput>;
} & MergeAllRemainingProps<T, TItems, TOptionalInput>;

function withListMapper<T extends object>(Wrapped: ComponentType<T>) {
  function Component<
    TItems extends AnyObjectProps | readonly unknown[],
    TOptionalInput = undefined,
  >(props: WithListMapperImplProps<T, TItems, TOptionalInput>) {
    const { items, optional, ...rest } = props;

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <ListMapper items={items} optional={optional as any}>
        <Wrapped {...(rest as T)} />
      </ListMapper>
    );
  }

  createNameForHOC("withListMapper", Wrapped, Component);

  return Component as WithListMapperComponent<T>;
}

/**
 * HOC to wrap a component with ListMapper functionality.
 *
 * @example
 *
 * ```tsx
 * const MyListItemWithListMapper = withListMapper(MyComponentThatNeedsListMapping);
 *
 * // Without optional:
 * <MyListItemWithListMapper items={myItems} otherProp="value" />
 *
 * // With optional as function (return type drives prop inference):
 * <MyListItemWithListMapper items={myItems} optional={(item) => ({ extraProp: item.name })} />
 *
 * // With optional as static value:
 * <MyListItemWithListMapper items={myItems} optional={{ extraProp: "shared" }} />
 * ```
 */
export default withListMapper;
