import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { Command, CommandItem } from "@/components/ui/command.tsx";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { ComponentProps, ReactNode } from "react";

/** A heading with a title and corresponding values */
export type HeadingType = {
  groupTitle: string;
  groupId: UUID;
  items: CommandItemType[];
};

export type DetailedCommandItem = CommandItemType & {
  groupTitle?: string;
  groupId: UUID;
};

export type CommandItemType = {
  id: UUID;
  value: string;
  name: string;
  [key: string]: unknown;
};

/**
 * Props for command-based components
 */
export type CommandsProps = {
  avatarDisplay?: boolean;
  useCommands?: boolean;
  multiSelection?: boolean;
  creationButtonText?: ReactNode;
  useButtonAddNew?: boolean;
  onAddNewItem?: (payload: HandleAddNewItemParams) => void;
  commandHeadings?: HeadingType[];
  queryRecordsKey?: string[];
  /** Callback appelé quand un item de commande est sélectionné */
  onSelect?: (value: string, commandItem: CommandItemType) => void;
} & Omit<ComponentProps<typeof Command>, "onSelect">;

/**
 * Props for CommandSelectionItem component.
 */
export type CommandSelectionItemProps = {
  command: CommandItemType & { isSelected?: boolean };
  details?: Record<string, any>;
  selectedValue: string | Set<string>;
} & Omit<ComponentProps<typeof CommandItem>, "onSelect"> &
  Omit<CommandsProps, "commandHeadings">;
