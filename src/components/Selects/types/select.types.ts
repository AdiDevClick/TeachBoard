import type { ReactElement, ReactNode } from "react";

/** Props for the LabelledGroup component */
export type LabelledGroupProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [0]: string;
  [1]: T[];
  index: number;
  children?:
    | ReactElement<Partial<{ item: T; index: number }>>
    | ((
        item: T extends Record<string, unknown> ? [string, T] : T,
        index: number
      ) => ReactNode);
};
