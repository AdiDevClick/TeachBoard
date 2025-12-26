import { CommandSelectionItem } from "@/components/Command/CommandSelectionItem.tsx";
import type {
  CommandItemType,
  CommandsProps,
} from "@/components/Command/types/command.types.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx";
import {
  commandGroupContainsInvalid,
  commandItemContainsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { usePopoverFieldContextSafe } from "@/hooks/contexts/usePopover.ts";
import { CommandDialog } from "cmdk";
import { useCallback, type ComponentProps, type ComponentType } from "react";

/**
 * A command items component that displays headings and their corresponding values.
 *
 * @param commandHeadings - An array of headings with titles and values to be displayed
 * @param filter - Optional filter function for the command component
 * @param props - Props for the command items component
 * @returns A CommandItems component
 */
export function CommandItems(props: Readonly<CommandsProps>) {
  const {
    commandHeadings,
    onSelect: externalOnSelect,
    avatarDisplay,
    ...rest
  } = props;

  // !! IMPORTANT !! This context can be null
  const context = usePopoverFieldContextSafe();
  const selectedValue = context?.selectedValue || new Set<string>();
  const contextOnSelect = context?.onSelect;

  const handleSelect = useCallback(
    (value: string, commandItem: CommandItemType) => {
      contextOnSelect?.(value, commandItem);
      externalOnSelect?.(value, commandItem);
    },
    []
  );

  return (
    <>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <ListMapper items={commandHeadings ?? []}>
          {(item) => {
            if (commandGroupContainsInvalid(item)) {
              debugLogs("Rendering CommandGroup");
            }
            return (
              <>
                <CommandGroup key={item.groupTitle} heading={item.groupTitle}>
                  <ListMapper items={item.items}>
                    {(command) => {
                      if (commandItemContainsInvalid(command)) {
                        debugLogs("Rendering CommandItem");
                      }

                      const itemDetails = {
                        groupId: item.id,
                        groupName: item.groupTitle,
                      };

                      return (
                        <CommandSelectionItem
                          command={command}
                          details={itemDetails}
                          multiSelection={rest.multiSelection}
                          selectedValue={selectedValue}
                          avatarDisplay={avatarDisplay}
                          onSelect={handleSelect}
                          {...rest}
                        />
                      );
                    }}
                  </ListMapper>
                </CommandGroup>
                <CommandSeparator />
              </>
            );
          }}
        </ListMapper>
      </CommandList>
    </>
  );
}

function withDialog(WrappedComponent: ComponentType) {
  return function DialogComponent(
    props: ComponentProps<typeof WrappedComponent>
  ) {
    return (
      <CommandDialog>
        <WrappedComponent {...props} />
      </CommandDialog>
    );
  };
}

function withComboBox(WrappedComponent: ComponentType) {
  return function ComboBoxComponent(props: CommandsProps) {
    return (
      <Command filter={props.filter}>
        <WrappedComponent {...props} />
      </Command>
    );
  };
}

export const CommandItemsForDialog = withDialog(CommandItems);
export const CommandItemsForComboBox = withComboBox(CommandItems);
