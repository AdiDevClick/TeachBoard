import type { ReactElement, ReactNode } from "react";

/** Props for the ListMapper component when items is an array */
export type ListMapperPropsArray<T> = {
  items: T[];
  children:
    | ReactElement<Partial<{ item: T; index: number }>>
    | ((item: T, index: number) => ReactNode);
};

/** Props for the ListMapper component when items is an object */
export type ListMapperPropsObject<T> = {
  items: { [key: string]: T };
  children:
    | ReactElement<Partial<{ item: T; index: number }>>
    | ((item: [string, T], index: number) => ReactNode);
};

/** Props for the ListMapper component */
export type ListMapperProps<T> =
  | ListMapperPropsObject<T>
  | ListMapperPropsArray<T>;

export type ListMapperType<T> =
  | ReactElement<Partial<{ item: T; index: number }>>
  | ReactNode;
