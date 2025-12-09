import { CommandItems } from "@/components/Command/CommandItems.tsx";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import type { PopoverFieldProps } from "@/components/Popovers/PopoverField.tsx";
import { Button } from "@/components/ui/button.tsx";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { PlusIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * HOC to add CommandItems and an optional "Add New" button to a component.
 *
 * @param Wrapped - The component to be wrapped with command functionalities.
 */
function withCommands(Wrapped: ComponentType) {
  return function Component<T extends CommandsProps>(
    props: T & PopoverFieldProps
  ) {
    const {
      useCommands,
      children,
      creationButtonText,
      useButtonAddNew,
      onAddNewItem,
      commandHeadings,
      ...rest
    } = props;

    const { apiEndpoint, task } = props;

    return (
      <Wrapped {...rest}>
        {children}
        {useCommands && (
          <CommandItems
            commandHeadings={commandHeadings ?? []}
            onTouchMove={restaureScrollBehavior}
            onWheel={restaureScrollBehavior}
            {...rest}
          />
        )}
        {useButtonAddNew && task && (
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between px-2 py-1.5 text-sm cursor-pointer"
            onClick={(e) =>
              onAddNewItem?.({ e, apiEndpoint: apiEndpoint!, task })
            }
          >
            <span>{creationButtonText}</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
      </Wrapped>
    );
  };
}

/**
 * Restores scroll behavior inside Command by simulating arrow key presses.
 *
 * !! IMPORTANT !! This is a workaround to allow scrolling within Command
 *
 * @param e - Scroll or Touch event
 */
function restaureScrollBehavior(e: WheelEvent | TouchEvent) {
  preventDefaultAndStopPropagation(e);
}

export default withCommands;
