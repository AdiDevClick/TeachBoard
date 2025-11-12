import type { ReactElement, ReactNode } from "react";
type ListMapperInjectedMeta<T> = {
  item: T | [string, T];
  index: number;
  __mapped: true;
};

/** Type for children that will receive mapped props - props become optional */
export type ListMapperPartialChildrenObject<T> = ReactElement<
  ListMapperInjectedMeta<T>
>;
// export type ListMapperPartialChildrenObject<T> = ReactElement<
//   ListMapperInjectedMeta<T> | Partial<ListMapperInjectedMeta<T>>
// >;

/** Props for the ListMapper component when items is an array */
export type ListMapperPropsArray<T> = {
  items: T[];
  children:
    | ListMapperPartialChildrenObject<T>
    | ((item: T, index: number) => ReactNode);
};

/** Props for the ListMapper component when items is an object */
export type ListMapperPropsObject<T> = {
  items: { [key: string]: T };
  children:
    | ListMapperPartialChildrenObject<T>
    | ((item: [string, T], index: number) => ReactNode);
};

/** Props for the ListMapper component */
export type ListMapperProps<T> =
  | ListMapperPropsObject<T>
  | ListMapperPropsArray<T>;

export type ListMapperType = ReactElement | ReactNode;
