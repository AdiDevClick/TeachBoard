import { CommandItemsForComboBox } from "@/components/Command/exports/command-items.exports";
import type { WithComboBoxCommandsResultProps } from "@/components/HOCs/types/with-combo-box-commands.types";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { createNameForHOC } from "@/utils/utils";
import { PlusIcon } from "lucide-react";
import { createElement, type ComponentType } from "react";

/**
 * HOC to add command‑panel functionality to a base component.
 * The resulting component accepts the original props of `Wrapped` plus the
 * extras defined in `WithComboBoxCommandsExtra`.
 */
function withComboBoxCommands<P extends object>(Wrapped: ComponentType<P>) {
  function Component(props: WithComboBoxCommandsResultProps<P>) {
    const {
      useCommands = true,
      children,
      creationButtonText = "Add New",
      useButtonAddNew = false,
      onClick,
      controllerFieldMeta,
      ...rest
    } = props;

    const effectiveTask = controllerFieldMeta?.task;

    return createElement(
      Wrapped,
      rest as P,
      <>
        {children}
        {useCommands && <CommandItemsForComboBox {...rest} />}
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
  }

  createNameForHOC("withComboBoxCommands", Wrapped, Component);
  return Component;
}

export default withComboBoxCommands;
