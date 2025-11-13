import type { ListMapperProps } from "@/components/Lists/types/ListsTypes.ts";
import { cloneElement, isValidElement } from "react";
import { Fragment } from "react/jsx-runtime";

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
  TOptional = undefined
>({
  items,
  optional,
  children,
  components,
}: Readonly<ListMapperProps<TItems, TOptional>>) {
  const isArrayInput = Array.isArray(items);
  const itemsArray = isArrayInput ? items : Object.entries(items);

  return (
    <>
      {itemsArray.map((item, index) => {
        if (!item) {
          return null;
        }

        const itemId =
          typeof item === "object" && "id" in item
            ? item.id
            : index * Math.random();

        // Case A: component prop provided (act as a Component but you provide the child to display as a prop)
        if (components) {
          const Components = components;
          return (
            <Fragment key={String(itemId)}>
              <Components {...item} index {...optional} __mapped />
            </Fragment>
          );
        }

        // Case B: Render function - best type safety (act as a function with params)
        if (typeof children === "function") {
          return children(item, index, optional as TOptional);
        }

        // Case C: ReactElement - render its type with injected props
        if (isValidElement(children)) {
          return (
            <Fragment key={String(itemId)}>
              {cloneElement(children, {
                ...item,
                index,
                ...optional,
                __mapped: true,
              })}
            </Fragment>
          );
        }

        return null;
      })}
    </>
  );
}
