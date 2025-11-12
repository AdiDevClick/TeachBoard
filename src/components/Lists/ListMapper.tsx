import type {
  ListMapperProps,
  ListMapperPropsArray,
  ListMapperPropsObject,
  ListMapperType,
} from "@/components/Lists/types/ListsTypes.ts";
import { cloneElement, Fragment, isValidElement, type ReactNode } from "react";

/**
 * A generic list component that will map over its items list
 *
 * @description This component will render a list of components
 * or let you access the individual items through a custom function.
 * If you do not need to access the individual items or a custom logic,
 * the props item and index will be passed over to the children.
 * @param items - The items array or object to render.
 * @param children - Either a React Component (will automatically receive the `item` and `index` props),
 * or a function `(item, index) => ReactNode` for custom logic.
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
 * > <ListMapper items={myItems}>
 * >    <MyListItem /> // { item, index } props will be passed automatically
 * > </ListMapper>
 * ```
 */

// Surcharge pour les arrays
export function ListMapper<T>(
  props: Readonly<ListMapperPropsArray<T>>
): ListMapperType;

// Surcharge pour les objets
export function ListMapper<T>(
  props: Readonly<ListMapperPropsObject<T>>
): ListMapperType;

// Implémentation
export function ListMapper<T>({
  items,
  children,
}: Readonly<ListMapperProps<T>>): ListMapperType {
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

        if (typeof children === "function") {
          return (
            children as (item: T | [string, T], index: number) => ReactNode
          )(item, index);
        }

        if (isValidElement(children)) {
          return (
            <Fragment key={String(itemId)}>
              {cloneElement(children, {
                ...item,
                index,
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
