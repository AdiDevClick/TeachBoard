import type { ListMapperPartialChildrenObject } from "@/components/Lists/types/ListsTypes.ts";

/** Props for the LabelledGroup component */
export type LabelledGroupProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [0]?: string;
  [1]?: T[];
  index?: number;
  children?: ListMapperPartialChildrenObject<T>;
};
