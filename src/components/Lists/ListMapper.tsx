import type { ListMapperProps } from "@/components/Lists/types/ListsTypes.ts";
import type {
  AnyComponentLike,
  ComponentPropsOf,
  ExtractItemType,
  MissingRequiredProps,
} from "@/utils/types/types.utils.ts";
import {
  Fragment,
  isValidElement,
  useId,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * A generic list component that will map over its items list
 *
 * @description This component will render a list of components
 * or let you access the individual items through a custom function.
 * If you do not need to access the individual items or a custom logic,
 * the props item and index will be passed over to the children.
 * @param items - The items array or object to render. Prefer the function if you need access to the item key when using an object (the item we not be merged)
 * @param optional - Optional additional props to pass to each child (Will not be iterated). All props will be merged.
 * @param children - Either a React Component (will automatically receive the `item` and `index` and `optional` props),
 * or a function `(item, index, optional) => ReactNode` for custom logic.
 * @example
 *
 * > **Use with a function for custom logic with an array:**
 * > ```tsx
 * > <ListMapper items={myItemsArray}>
 * >    {(item, index) => (
 * >       <MyListItem key={item.id} item={item} index={index} />
 * >    )}
 * > </ListMapper>
 *
 * > **Use with a function for custom logic with an object:**
 * > ```tsx
 * > <ListMapper items={myItemsObject}>
 * >    {([key, item], index) => (
 * >       <MyListItem key={key} item={item} index={index} />
 * >    )}
 * > </ListMapper>
 *
 * > **Use with a children**
 * > ```tsx
 * > <ListMapper items={myItems} optional={myOptionalProps}>
 * >    <MyListItem /> // { item, index, optional } props will be passed automatically
 * > </ListMapper>
 *
 * > **Use like a Component (type safety as it's a component)**
 * > ```tsx
 * > <ListMapper components={MyListItem} items={myItems} optional={myOptionalProps}/>
 * ```
 */
export function ListMapper<
  TItems extends readonly unknown[] | Record<string, unknown>,
  C extends ElementType = ElementType,
  TOptional extends Record<string, unknown> | undefined = undefined
>({
  items,
  optional,
  children,
  component,
  ...props
}: Readonly<ListMapperProps<TItems, C, TOptional>>) {
  const id = useId();
  if (!items || items === undefined) return null;

  const isArrayInput = Array.isArray(items);
  const itemsArray = isArrayInput
    ? items
    : Object.entries(items as Record<string, unknown>);

  return itemsArray.map((item, index) => {
    if (!item) {
      return null;
    }

    // !!IMPORTANT!! For consistency, ListMapper MUST return an object containing the id and its item.
    // Generate a stable key for each item -
    // If the item does not have an id (e.g., a primitive), construct one.
    if (typeof item !== "object") {
      item = { item };
    }

    if ("id" in item) {
      // item.id exists
    } else {
      item.id = `${id}-${index * Math.random()}`;
    }

    // Case A: component prop provided (act as a Component but you provide the child to display as a prop)

    if (component) {
      const Component = component;

      return (
        <Component key={String(item.id)} {...item} {...optional} {...props} />
      );
    }

    // Case B: Render function - best type safety (act as a function with params)
    if (typeof children === "function") {
      const renderFn = children as (
        item: unknown,
        index: number,
        optional?: TOptional
      ) => ReactNode;

      return (
        <Fragment key={item.id ?? `${id}-${index}`}>
          {renderFn(item, index, optional)}
        </Fragment>
      );
    }

    // Case C: ReactElement - render its type with injected props
    if (isValidElement(children)) {
      const injectedProps = {
        ...item,
        index: index,
        ...optional,
      };

      //   <Fragment key={String(item.id)}>
      //     {cloneElement(children, injectedProps)}
      //   </Fragment>
      // );

      const Component = children.type as ElementType;
      const originalChildProps = (children.props ?? {}) as Record<
        string,
        unknown
      >;

      return (
        // <Fragment key={String(item.id)}>
        <Component
          key={String(item.id)}
          {...originalChildProps}
          {...injectedProps}
        />
        // </Fragment>
      );
    }

    return null;
  });
}

