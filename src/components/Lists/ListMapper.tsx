import { retrieveOptional } from "@/components/Lists/functions/list-mapper.functions";
import type { ChildrenFunctionMode } from "@/components/Lists/types/ListsTypes";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
  debugLogs,
  listMapperContainsInvalid,
} from "@/configs/app-components.config.ts";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import { wait } from "@/utils/utils.ts";
import {
  Activity,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useState,
} from "react";

/**
 * A generic list component that will map over its items list
 *
 * @remarks There is an overload version of this component that allows you to pass a component @see ListMapper.overloads.d.ts
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
 * > <ListMapper component={MyListItem} items={myItems} optional={myOptionalProps}/>
 * ```
 */

export function ListMapper<
  TItems extends readonly unknown[] | AnyObjectProps,
  TOptionalValue = undefined,
>(props: ChildrenFunctionMode<TItems, TOptionalValue>) {
  const { items, optional, children, ...rest } = props as any;

  const id = useId();

  const [isWaiting, setIsWaiting] = useState(true);

  /**
   * Loading state.
   *
   * @remarks If a list of items is EMPTY, the spinner will be shown for 2 seconds max.
   *
   * @description Makes it easier to understand that the system is loading data.
   */
  useEffect(() => {
    const showLoading = async () => {
      await wait(2000);
      setIsWaiting(false);
    };
    showLoading();

    return () => {
      setIsWaiting(false);
    };
  }, []);

  if (listMapperContainsInvalid(props)) {
    debugLogs("ListMapper");
    return null;
  }

  const isArrayInput = Array.isArray(items);
  const itemsArray = isArrayInput
    ? items
    : items != null
      ? Object.entries(items)
      : [];

  if (!itemsArray || itemsArray.length === 0) {
    if (isWaiting) {
      return (
        <Activity mode="visible">
          <Spinner className="m-auto size-5" />
        </Activity>
      );
    }
    return null;
  }

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

    // Use existing id or create a stable one based on index only
    const itemId = "id" in item ? item.id : `${id}-${index}`;

    // Case B: Render function - best type safety (act as a function with params)
    if (typeof children === "function") {
      const renderFn = children;

      const injectedOptional = retrieveOptional(optional, item, index);

      return (
        <Fragment key={itemId}>
          {renderFn(item, index, injectedOptional)}
        </Fragment>
      );
    }

    // Case C: ReactElement - render its type with injected props
    if (isValidElement(children)) {
      const injectedOptional = retrieveOptional(optional, item, index);

      const injectedProps = {
        ...item,
        index: index,
        ...injectedOptional,
        ...rest,
      };

      const Component = children.type;
      const originalChildProps = children.props ?? {};

      return (
        <Component key={itemId} {...originalChildProps} {...injectedProps} />
      );
    }

    return null;
  });
}
