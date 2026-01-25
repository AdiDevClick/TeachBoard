import { AvatarDisplay } from "@/components/Avatar/AvatarDisplay.tsx";
import type { CommandSelectionItemProps } from "@/components/Command/types/command.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { CommandItem } from "@/components/ui/command.tsx";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { CheckIcon, Plus } from "lucide-react";
import {
  Activity,
  useCallback,
  useState,
  type TouchEvent,
  type WheelEvent,
} from "react";

/**
 * Props for CommandSelectionItem component.
 *
 * @param command - The command item data.
 * @param details - Additional details for the command item.
 * @param multiSelection - Flag indicating if multiple selections are allowed.
 */
export function CommandSelectionItem(props: CommandSelectionItemProps) {
  const {
    command,
    details,
    multiSelection,
    selectedValue,
    onSelect,
    avatarDisplay,
    // ...rest
  } = props;

  const [avatarSelection, setAvatarSelection] = useState(
    command.isSelected || false,
  );

  const { id, disabled, value } = command;
  let isSelected = false;
  if (multiSelection) {
    isSelected = selectedValue instanceof Set && selectedValue.has(value);
  } else {
    isSelected = selectedValue === value;
  }

  const selectCallback = useCallback((value: string) => {
    if (avatarDisplay) {
      command.isSelected = !command.isSelected;
      setAvatarSelection(command.isSelected);
    }
    onSelect?.(value, { ...command, ...details });
  }, []);

  const avatarProps = {
    ...command,
    name: command.name ?? command.label ?? command.value,
    email: command.email ?? "",
    avatar: command.avatar ?? "",
  };

  return (
    <CommandItem
      id={id}
      value={value}
      disabled={disabled}
      onTouchMove={restaureScrollBehavior}
      onWheel={restaureScrollBehavior}
      onSelect={selectCallback}
    >
      <Activity mode={avatarDisplay ? "visible" : "hidden"}>
        <AvatarDisplay props={avatarProps}>
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
 * Restores scroll behavior inside Command by simulating arrow key presses.
 *
 * !! IMPORTANT !! This is a workaround to allow scrolling within Command
 *
 * @param e - Scroll or Touch event
 */
function restaureScrollBehavior(
  e: WheelEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
) {
  preventDefaultAndStopPropagation(e);
}
