import type { CommandsProps } from "@/components/Command/types/command.types.ts";
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
  const selectedValue = context?.selectedValue ?? "";

  const handleSelect = useCallback((value: string) => {
    contextOnSelect?.(value);
    externalOnSelect?.(value);
  }, []);

  return (
    <Command
      filter={filter}
      // onChange={(e) => preventDefaultAndStopPropagation(e)}
    >
      <CommandInput placeholder="Search..." />

      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <ListMapper items={commandHeadings ?? []}>
          {({ groupTitle, items }) => {
            if (commandGroupContainsInvalid(props)) {
              debugLogs("Rendering CommandGroup");
            }
            return (
              <CommandGroup key={groupTitle} heading={groupTitle}>
                <ListMapper items={items}>
                  {({ id, value }) => {
                    if (commandItemContainsInvalid(props)) {
                      debugLogs("Rendering CommandItem");
                    }
                    return (
                      <CommandItem
                        key={id}
                        id={String(id)}
                        value={value}
                        onSelect={handleSelect}
                        {...rest}
                      >
                        {value ?? "Valeur inconnue"}
                        {selectedValue === value && (
                          <CheckIcon className={"ml-auto"} />
                        )}
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
