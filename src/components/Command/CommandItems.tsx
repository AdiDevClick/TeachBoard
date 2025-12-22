import type {
  CommandItemType,
  CommandsProps,
} from "@/components/Command/types/command.types.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { AvatarDisplay } from "@/components/Sidebar/footer/AvatarDisplay.tsx";
import { Button } from "@/components/ui/button.tsx";
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
import { CommandDialog } from "cmdk";
import { CheckIcon, Plus } from "lucide-react";
import {
  Activity,
  useCallback,
  useState,
  type ComponentProps,
  type ComponentType,
} from "react";

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
  const [selectedValue, setSelectedValue] = useState(
    context?.selectedValue || new Set()
  );
  const contextOnSelect = context?.onSelect;

  const handleSelect = useCallback(
    (value: string, commandItem: CommandItemType) => {
      contextOnSelect?.(value, commandItem);
      externalOnSelect?.(value, commandItem);

      if (props.multiSelection && avatarDisplay) {
        setSelectedValueCallback(value);
      }
    },
    []
  );

  /**
   * Callback to handle selection of a value
   */
  const setSelectedValueCallback = (value: string) =>
    setSelectedValue((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });

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
                        disabled={command.disabled}
                        key={command.id}
                        id={String(command.id)}
                        value={command.value}
                        onSelect={(e) => handleSelect(e, itemDetails)}
                        {...rest}
                      >
                        <Activity mode={avatarDisplay ? "visible" : "hidden"}>
                          <AvatarDisplay props={command}>
                            <Button
                              size="icon-sm"
                              variant="outline"
                              className="rounded-full"
                              aria-label="Invite"
                            >
                              {defineSelection(
                                command.value,
                                selectedValue,
                                rest.multiSelection
                              ) ? (
                                <CheckIcon />
                              ) : (
                                <Plus />
                              )}
                            </Button>
                          </AvatarDisplay>
                        </Activity>
                        <Activity mode={avatarDisplay ? "hidden" : "visible"}>
                          {command.value}
                          {defineSelection(
                            command.value,
                            selectedValue,
                            rest.multiSelection
                          ) && <CheckIcon className={"ml-auto"} />}
                        </Activity>
                      </CommandItem>
                    );
                  }}
                </ListMapper>
              </CommandGroup>
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

export const CommandItemsForDialog = withDialog(CommandItems);
export const CommandItemsForComboBox = withComboBox(CommandItems);
