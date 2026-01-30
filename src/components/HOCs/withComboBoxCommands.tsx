import { CommandItemsForComboBox } from "@/components/Command/CommandItems.tsx";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import type { PopoverFieldProps } from "@/components/Popovers/types/popover.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { PlusIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * HOC to add CommandItems and an optional "Add New" button to a component.
 *
 * @param Wrapped - The component to be wrapped with command functionalities.
 */
function withComboBoxCommands<P extends PopoverFieldProps>(
  Wrapped: ComponentType<P>,
) {
  return function Component(props: P & CommandsProps) {
    const {
      useCommands,
      children,
      creationButtonText,
      useButtonAddNew,
      onAddNewItem,
      ...rest
    } = props;

    const { apiEndpoint, dataReshapeFn, task } = props;

    return (
      <Wrapped {...(rest as P)}>
        {children}
        {useCommands && (
          <CommandItemsForComboBox {...(rest as CommandsProps)} />
        )}

        {useButtonAddNew && task && (
          <>
            <Separator />
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between px-2 py-1.5 text-sm cursor-pointer"
              onClick={(e) =>
                onAddNewItem?.({
                  e,
                  apiEndpoint: apiEndpoint!,
                  task,
                  dataReshapeFn,
                })
              }
            >
              <span>{creationButtonText}</span>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </Wrapped>
    );
  };
}

export default withComboBoxCommands;
