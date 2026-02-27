import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { PopoverSelectionValue } from "@/components/Popovers/types/popover.types";
import type { Command, CommandItem } from "@/components/ui/command.tsx";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import type { ComponentProps } from "react";

/** A heading with a title and corresponding values */
export type HeadingType = {
  id: UUID;
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
  isSelected?: boolean;
  [key: string]: unknown;
};

export type DetailedCommandItem = CommandItemType & {
  groupId: UUID;
};

/**
 * Props for command-based components
 */
export type CommandsProps = Readonly<
  {
    /** Render tiny avatars next to items (used by the class creation screens) */
    commandHeadings?: HeadingType[];
  } & Omit<
    CommandSelectionItemProps,
    "command" | "details" | "selectedValue" | "onClick"
  >
>;

/**
 * A combo box version that allows filtering with a function passed to the `filter` prop of the underlying `Command` component.
 */
export type ComboBoxProps = {
  /**
   * Filter function forwarded to the underlying `Command` component.
   */
  filter?: ComponentProps<typeof Command>["filter"];
};

/**
 * Type for the HOC withComboBox that adds command and filtering capabilities to a component.
 */
export type ComboProps<C extends object> = Omit<C, keyof ComboBoxProps> &
  ComboBoxProps;

/**
 * Props for CommandSelectionItem component.
 */
export type CommandSelectionItemProps = {
  /**
   * If true, allows multiple items to be selected. In this case, `selectedValue` should be a Set of selected values.
   */
  avatarDisplay?: boolean;
  /**
   * The command item data. Should contain at least an `id` and `value`, but can also include optional fields like `name`, `label`, `email`, and `avatar` for richer display in command lists.
   */
  command: CommandItemType;
  /**
   * Additional details for the command item, such as grouping metadata. This is passed to the `onSelect` callback when an item is selected, allowing consumers to have context about the selection (e.g., which group it belongs to).
   */
  details?: CommandDetails;
  /**
   * If true, allows multiple items to be selected. In this case, `selectedValue` should be a Set of selected values.
   */
  multiSelection?: boolean;
  /**
   * The currently selected value(s). This should be a string for single selection mode, or a Set of strings for multi-selection mode
   */
  selectedValue: PopoverSelectionValue;
  // selectedValue: string | Set<string>;
  /**
   * This allows consumers to handle the selection event and update their state accordingly.
   */
  onSelect?: (value: string, commandItem: CommandItemType) => void;
} & Omit<ComponentProps<typeof CommandItem>, "onSelect">;

export type CommandDetails = {
  groupId?: UUID;
  groupName?: string;
} & AnyObjectProps;
