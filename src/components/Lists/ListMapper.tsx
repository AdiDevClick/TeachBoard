import type {
  ListMapperProps,
  ListMapperType,
} from "@/components/Lists/types/ListsTypes.ts";
import { cloneElement, Fragment, isValidElement } from "react";

/**
 * A generic list component that will map over its items list
 *
 * @description This component will render a list of components
 * or let you access the individual items through a custom function.
 * If you do not need to access the individual items or a custom logic,
 * the props item and index will be passed over to the children.
 * @param items - The items array to render.
 * @param children - Either a React Component (will automatically receive the `item` and `index` props),
 * or a function `(item, index) => ReactNode` for custom logic.
 * @example
 *
 * > **Use with a function for custom logic :**
 * > ```tsx
 * > <ListMapper items={myItems}>
 * >    {(item, index) => (
 * >       // return (My custom logic here) or component :
 * >       <MyListItem key={item.id} item={item} index={index} />
 * >    )}
 * > </ListMapper>
 *
 * > **Use with a children**
 * > ```tsx
 * > <ListMapper items={myItems}>
 * >    <MyListItem /> // { item, index } props will be passed automatically
 * > </ListMapper>
 * ```
 */

export function ListMapper<T>({
  items,
  children,
}: Readonly<ListMapperProps<T>>): ListMapperType<T> {
  return (
    <>
      {items.map((item, index) => {
        if (!item) {
          return null;
        }

        const itemId =
          typeof item === "object" && "id" in item
            ? item.id
            : index * Math.random();

        if (typeof children === "function") {
          return children(item, index);
        }

        if (isValidElement(children)) {
          return (
            <Fragment key={String(itemId)}>
              {cloneElement(children, {
                ...item,
                index,
              })}
            </Fragment>
          );
        }

        return null;
      })}
    </>
  );
}
