import { CommandItems } from "@/components/Command/CommandItems";
import type { ComboProps } from "@/components/Command/types/command.types";
import { Command, CommandDialog } from "@/components/ui/command";
import { createComponentName, createNameForHOC } from "@/utils/utils";
import type { ComponentProps, ComponentType } from "react";

/**
 * HOC to wrap a component with CommandDialog, providing dialog functionalities.
 */
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

/**
 * HOC to wrap a component with Command, providing ComboBox functionalities.
 *
 * @param filter - The filter function to be passed to the Command component, enabling ComboBox features.
 */
export function withComboBox<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  function ComboBoxComponent(props: ComboProps<P>) {
    const { filter, ...rest } = props;

    return (
      <Command filter={filter}>
        <WrappedComponent {...(rest as P)} />
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
