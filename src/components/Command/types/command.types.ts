import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { Command, CommandItem } from "@/components/ui/command.tsx";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { ComponentProps, ReactNode } from "react";

/** A heading with a title and corresponding values */
export type HeadingType = {
  // id?: UUID;
  groupTitle: string;
  items: CommandItemType[];
};

export type CommandItemType = {
  id: UUID;
  value: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  /** Optional user-ish fields used by AvatarDisplay in command lists */
  email?: string;
  avatar?: string;
  /** Optional grouping metadata (present when coming from grouped headings) */
  groupTitle?: string;
  groupId?: UUID;
  [key: string]: unknown;
};

export type DetailedCommandItem = CommandItemType & {
  groupId: UUID;
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
  onAddNewItem?: (_payload: HandleAddNewItemParams) => void;
  commandHeadings?: HeadingType[];
  queryRecordsKey?: string[];
  onSelect?: (_value: string, _commandItem: CommandItemType) => void;
} & Omit<ComponentProps<typeof Command>, "onSelect">;

/**
 * Props for CommandSelectionItem component.
 */
export type CommandSelectionItemProps = {
  command: CommandItemType & { isSelected?: boolean };
  details?: Record<string, unknown>;
  selectedValue: string | Set<string>;
} & Omit<ComponentProps<typeof CommandItem>, "onSelect"> &
  Omit<CommandsProps, "commandHeadings">;
