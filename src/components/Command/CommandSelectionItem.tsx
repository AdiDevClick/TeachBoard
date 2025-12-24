import { AvatarDisplay } from "@/components/Avatar/AvatarDisplay.tsx";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { CommandItem } from "@/components/ui/command.tsx";
import { CheckIcon, Plus } from "lucide-react";
import { Activity, useCallback, useState } from "react";

export function CommandSelectionItem(props: CommandSelectionItemProps) {
  const {
    command,
    details,
    multiSelection,
    selectedValue,
    onSelect,
    avatarDisplay,
    ...rest
  } = props;

  const [avatarSelection, setAvatarSelection] = useState(
    command.isSelected || false
  );
  const { id, disabled, value, ...otherCommands } = command;
  const isSelected = multiSelection
    ? selectedValue.has(value)
    : selectedValue === value;

  const selectCallback = useCallback((value: string) => {
    if (avatarDisplay) {
      command.isSelected = !command.isSelected;
      setAvatarSelection(command.isSelected);
    }
    onSelect(value, { ...command, ...details });
  }, []);

  return (
    <CommandItem
      id={id}
      value={value}
      disabled={disabled}
      onSelect={selectCallback}
      {...rest}
    >
      <Activity mode={avatarDisplay ? "visible" : "hidden"}>
        <AvatarDisplay props={command}>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            className="rounded-full"
            aria-label="Invite"
          >
            {avatarSelection ? <CheckIcon /> : <Plus />}
          </Button>
        </AvatarDisplay>
      </Activity>
      <Activity mode={avatarDisplay ? "hidden" : "visible"}>
        {command.value}
        {isSelected && <CheckIcon className={"ml-auto"} />}
      </Activity>
    </CommandItem>
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
  multiSelection?: boolean,
  avatarDisplay?: boolean,
  command?: CommandItemType
) {
  if (!selectedValue) return false;

  if (multiSelection) {
    const isLocalSelection = (selectedValue as Set<string>).has(value);
    const isSelectedCommandAvailable =
      avatarDisplay && command?.isSelected !== undefined;
    if (isSelectedCommandAvailable) {
      if (command.isSelected && isLocalSelection) return false;
      return command.isSelected;
    }
    return isLocalSelection;
  }
  return selectedValue === value;
  // return multiSelection
  //   ? (selectedValue as Set<string>).has(value)
  //   : selectedValue === value;
}
