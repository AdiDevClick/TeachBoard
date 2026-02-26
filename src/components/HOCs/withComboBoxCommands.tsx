import { CommandItemsForComboBox } from "@/components/Command/exports/command-items.exports";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { PlusIcon } from "lucide-react";
import { createElement, type ComponentProps, type ComponentType } from "react";

/**
 * HOC to add CommandItems and an optional "Add New" button to a component.
 *
 * @param Wrapped - The component to be wrapped with command functionalities.
 */
function withComboBoxCommands<P extends ComponentType>(Wrapped: P) {
  return function Component(props: P & CommandsProps) {
    const {
      useCommands,
      children,
      creationButtonText,
      useButtonAddNew,
      onClick,
      controllerFieldMeta,
      ...rest
    } = props;

    const effectiveTask = controllerFieldMeta?.task;

    return createElement(
      Wrapped,
      {
        ...rest,
      } as ComponentProps<P>,
      <>
        {children}
        {useCommands && (
          <CommandItemsForComboBox {...(rest as CommandsProps)} />
        )}

        {useButtonAddNew && effectiveTask && (
          <>
            <Separator />
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between px-2 py-1.5 text-sm cursor-pointer"
              onClick={onClick}
            >
              <span>{creationButtonText}</span>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </>,
    );
  };
}

export default withComboBoxCommands;
