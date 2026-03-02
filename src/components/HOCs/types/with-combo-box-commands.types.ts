/**
 * @fileoverview HOC to add CommandItems and an optional "Add New" button to a component.
 */

import type { CommandItemsForComboBox } from "@/components/Command/exports/command-items.exports";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import type { RemoveStringIndex } from "@/utils/types/types.utils";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

/**
 * Props that may be forwarded to the embedded command widget.
 * These are exactly the props accepted by `CommandItemsForComboBox`.
 */
export type WithComboBoxCommandsBaseProps = ComponentProps<
  typeof CommandItemsForComboBox
>;

type WithComboBoxCommandsBaseOwnProps =
  RemoveStringIndex<WithComboBoxCommandsBaseProps>;

/**
 * Additional options added by the HOC itself.
 */
export interface WithComboBoxCommandsExtra {
  /** whether the command panel should be rendered @default true */
  useCommands?: boolean;
  /** if true, show an "add new" footer button  @default false */
  useButtonAddNew?: boolean;
  /** label shown inside the add‑new button @default "Add New" */
  creationButtonText?: string;
  /** click handler for the add‑new button */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** metadata supplied by `withEventEnrichedMetadatas` or similar */
  controllerFieldMeta?: CommandHandlerFieldMeta;
  /** allow the wrapped component to receive children */
  children?: ReactNode;
}

/**
 * Props consumed by the enhanced component returned from the HOC.
 * It combines the command‑widget props with the HOC extras.
 */
export type WithComboBoxCommandsProps = WithComboBoxCommandsBaseOwnProps &
  WithComboBoxCommandsExtra;

/**
 * Utility type for the result of `withComboBoxCommands`.
 * It merges the wrapped component's own props with the HOC props,
 * dropping any properties on `P` that would conflict with the HOC.
 */
export type WithComboBoxCommandsResultProps<P extends object> = Omit<
  RemoveStringIndex<P>,
  keyof WithComboBoxCommandsProps
> &
  (WithComboBoxCommandsBaseOwnProps & WithComboBoxCommandsExtra);
