import type { ReactElement, ReactNode } from "react";

/** Props for the ListMapper component */
export type ListMapperProps<T> = {
  items: T[] | { [key: string]: T };
  children:
    | ReactElement<Partial<{ item: T; index: number }>>
    | ((item: T, index: number) => ReactNode);
};

export type ListMapperType<T> =
  | ReactElement<Partial<{ item: T; index: number }>>
  | ReactNode;
