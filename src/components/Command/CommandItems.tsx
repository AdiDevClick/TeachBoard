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
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  commandGroupContainsInvalid,
  commandItemContainsInvalid,
  debugLogs,
} from "@/configs/app-components.config.ts";
import { usePopoverFieldContextSafe } from "@/hooks/contexts/usePopover.ts";
import { CheckIcon } from "lucide-react";
import { useCallback } from "react";

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
    filter,
    onSelect: externalOnSelect,
    ...rest
  } = props;

  // !! IMPORTANT !! This context can be null
  const context = usePopoverFieldContextSafe();
  const contextOnSelect = context?.onSelect;
  const selectedValue = context?.selectedValue;

  const handleSelect = useCallback(
    (value: string, commandItem: CommandItemType) => {
      contextOnSelect?.(value, commandItem);
      externalOnSelect?.(value, commandItem);
    },
    []
  );

  return (
    <Command
      filter={filter}
      // onChange={(e) => preventDefaultAndStopPropagation(e)}
    >
      <CommandInput placeholder="Search..." />

      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <ListMapper items={commandHeadings ?? []}>
          {(item) => {
            if (commandGroupContainsInvalid(item)) {
              debugLogs("Rendering CommandGroup");
            }
            return (
              <CommandGroup key={item.groupTitle} heading={item.groupTitle}>
                <ListMapper items={item.items}>
                  {(command) => {
                    if (commandItemContainsInvalid(command)) {
                      debugLogs("Rendering CommandItem");
                    }
                    const itemDetails = {
                      groupId: item.id,
                      groupName: item.groupTitle,
                      ...command,
                    };

                    return (
                      <CommandItem
                        key={command.id}
                        id={String(command.id)}
                        value={command.value}
                        onSelect={(e) => handleSelect(e, itemDetails)}
                        {...rest}
                      >
                        {command.value ?? "Valeur inconnue"}
                        {defineSelection(
                          command.value,
                          selectedValue,
                          rest.multiSelection
                        ) && <CheckIcon className={"ml-auto"} />}
                      </CommandItem>
                    );
                  }}
                </ListMapper>
              </CommandGroup>
            );
          }}
        </ListMapper>
      </CommandList>
    </Command>
  );
}

/**
 * Define if the item is selected based on selection mode
 *
 * @param value - The value of the item
 * @param selectedValue - The currently selected value(s)
 * @param multiSelection - Whether multi-selection is enabled
 * @returns True if the item is selected, false otherwise
 */
function defineSelection(
  value: string,
  selectedValue?: string | Set<string>,
  multiSelection?: boolean
) {
  if (!selectedValue) return false;
  return multiSelection
    ? (selectedValue as Set<string>).has(value)
    : selectedValue === value;
}
