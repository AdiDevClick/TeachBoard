import { CommandItems } from "@/components/Command/CommandItems";
import type { CommandsProps } from "@/components/Command/types/command.types";
import { Command, CommandDialog } from "@/components/ui/command";
import { createComponentName, createNameForHOC } from "@/utils/utils";
import type { ComponentProps, ComponentType } from "react";

function withDialog(WrappedComponent: ComponentType) {
  function DialogComponent(props: ComponentProps<typeof WrappedComponent>) {
    return (
      <CommandDialog>
        <WrappedComponent {...props} />
      </CommandDialog>
    );
  }
  createNameForHOC("withDialog", WrappedComponent, DialogComponent);
  return DialogComponent;
}

function withComboBox(WrappedComponent: ComponentType) {
  function ComboBoxComponent(props: CommandsProps) {
    return (
      <Command filter={props.filter}>
        <WrappedComponent {...props} />
      </Command>
    );
  }

  createNameForHOC("withComboBox", WrappedComponent, ComboBoxComponent);
  return ComboBoxComponent;
}
export const CommandItemsForDialog = withDialog(CommandItems);
createComponentName(
  "withDialog",
  "CommandItemsForDialog",
  CommandItemsForDialog,
);
/**
 * A CommandItems component wrapped with a ComboBox for enhanced functionality.
 */
export const CommandItemsForComboBox = withComboBox(CommandItems);
createComponentName(
  "withComboBox",
  "CommandItemsForComboBox",
  CommandItemsForComboBox,
);
