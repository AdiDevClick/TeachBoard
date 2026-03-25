import { CommandSelectionItem } from "@/components/Command/CommandSelectionItem.tsx";
import type {
  CommandItemType,
  CommandsProps,
} from "@/components/Command/types/command.types.ts";
import { ListMapper } from "@/components/Lists/ListMapper";
import {
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

/**
 * A command items component that displays headings and their corresponding values.
 *
 * @param commandHeadings - An array of headings with titles and values to be displayed
 * @param filter - Optional filter function for the command component
 * @param onSelect - Optional callback function that is called when an item is selected, receiving the selected value and command item details
 *
 * @returns A CommandItems component
 */
export function CommandItems(props: CommandsProps) {
  const { commandHeadings, onSelect: externalOnSelect, ...rest } = props;

  // !! IMPORTANT !! This context can be null
  const context = usePopoverFieldContextSafe();
  const selectedValue = context?.selectedValue || new Set<string>();
  const contextOnSelect = context?.onSelect;

  const handleSelect = (value: string, commandItem: CommandItemType) => {
    contextOnSelect?.(value, commandItem);
    externalOnSelect?.(value, commandItem);
  };

  return (
    <>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <ListMapper items={commandHeadings ?? []}>
          {(item) => {
            if (commandGroupContainsInvalid(item)) {
              debugLogs("Skipping invalid CommandGroup", {
                type: "propsValidation",
                item,
              });
              return null;
            }
            return (
              <>
                <CommandGroup key={item.groupTitle} heading={item.groupTitle}>
                  <ListMapper items={item.items ?? []}>
                    {(command) => {
                      if (commandItemContainsInvalid(command)) {
                        debugLogs("Rendering CommandItems", {
                          type: "propsValidation",
                          command,
                        });
                      }

                      const itemDetails = {
                        groupId: item.id,
                        groupName: item.groupTitle,
                      };

                      return (
                        <CommandSelectionItem
                          details={itemDetails}
                          onSelect={handleSelect}
                          {...rest}
                          selectedValue={selectedValue}
                          command={command}
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
