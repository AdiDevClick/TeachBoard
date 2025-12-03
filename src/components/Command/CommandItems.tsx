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
import { usePopoverFieldContextSafe } from "@/hooks/contexts/usePopover.ts";
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

  const handleSelect = useCallback(
    (value: string) => {
      contextOnSelect?.(value);
      externalOnSelect?.(value);
    },
    [contextOnSelect, externalOnSelect]
  );

  return (
    <Command filter={filter} onChange={(e) => console.log("change", e)}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <ListMapper items={commandHeadings ?? []}>
          {({ groupTitle, items }) => (
            <CommandGroup key={groupTitle} heading={groupTitle}>
              <ListMapper items={items}>
                {({ id, value }) => (
                  <CommandItem
                    key={id}
                    id={String(id)}
                    value={value}
                    onSelect={handleSelect}
                    {...rest}
                  >
                    {value ?? ""}
                  </CommandItem>
                )}
              </ListMapper>
            </CommandGroup>
          )}
        </ListMapper>
      </CommandList>
    </Command>
  );
}
