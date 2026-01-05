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
