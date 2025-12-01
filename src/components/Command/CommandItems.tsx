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

/**
 * A command items component that displays headings and their corresponding values.
 *
 * @param commandHeadings - An array of headings with titles and values to be displayed
 * @param filter - Optional filter function for the command component
 * @param props - Props for the command items component
 * @returns A CommandItems component
 */
export function CommandItems(props: Readonly<CommandsProps>) {
  const { commandHeadings, filter, ...rest } = props;

  return (
    <Command filter={filter}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <ListMapper items={commandHeadings}>
          {({ groupTitle, items }) => (
            <CommandGroup key={groupTitle} heading={groupTitle}>
              <ListMapper items={items}>
                {({ id, value }) => (
                  <CommandItem id={id} value={value} key={id}>
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
