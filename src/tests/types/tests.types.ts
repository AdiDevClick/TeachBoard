import type { CommandItemType } from "@/components/Command/types/command.types.ts";

/**
 * Options for configuring dialog behavior in tests.
 */
export type DialogOptions = {
  queryKey?: unknown;
};

/**
 * Form values used in command handler tests.
 */
export type TestFormValues = {
  selected: string[] | string;
  selectedDetailed: Array<
    [string, Partial<CommandItemType> & { isSelected?: boolean }]
  >;
};

/**
 * Represents a cached item with optional properties.
 */
export type CachedItem = {
  id?: string;
  name?: string;
  value?: string;
} & Record<string, unknown>;

/**
 * Represents a cached group containing a title and an array of cached items.
 */
export type CachedGroup = { groupTitle: string; items: CachedItem[] };
