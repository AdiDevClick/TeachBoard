import type { HandleAddNewItemParams } from "@/components/ClassCreation/diploma/controller/DiplomaCreationController.tsx";
import type { Command } from "@/components/ui/command.tsx";
import type { ComponentProps, ReactNode } from "react";

/** A heading with a title and corresponding values */
export type HeadingType = {
  groupTitle: string;
  items: CommandItemType[];
};

export type CommandItemType = {
  id: string | number;
  value: string;
};

/**
 * Props for command-based components
 */
export type CommandsProps = {
  useCommands?: boolean;
  multiSelection?: boolean;
  creationButtonText?: ReactNode;
  useButtonAddNew?: boolean;
  onAddNewItem?: (payload: HandleAddNewItemParams) => void;
  commandHeadings?: HeadingType[];
  queryRecordsKey?: string[];
  /** Callback appelé quand un item de commande est sélectionné */
  onSelect?: (value: string) => void;
} & Omit<ComponentProps<typeof Command>, "onSelect">;
