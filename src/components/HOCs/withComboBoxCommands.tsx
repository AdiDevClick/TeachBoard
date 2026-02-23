import { CommandItemsForComboBox } from "@/components/Command/exports/command-items.exports";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import type {
  MetaDatasPopoverField,
  PopoverFieldProps,
} from "@/components/Popovers/types/popover.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import { PlusIcon } from "lucide-react";
import { createElement, type ComponentType } from "react";

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
      controllerFieldMeta,
      ...rest
    } = props;

    const resolvedMeta: CommandHandlerFieldMeta = {
      task: controllerFieldMeta?.task ?? props.task,
      apiEndpoint: controllerFieldMeta?.apiEndpoint ?? props.apiEndpoint,
      dataReshapeFn: controllerFieldMeta?.dataReshapeFn ?? props.dataReshapeFn,
      name: controllerFieldMeta?.name,
      id: controllerFieldMeta?.id,
    };

    const wrappedOnOpenChange = (
      isOpen: boolean,
      meta?: MetaDatasPopoverField,
    ) => {
      props.onOpenChange?.(isOpen, meta ?? resolvedMeta);
    };

    return createElement(
      Wrapped,
      {
        ...rest,
        controllerFieldMeta,
        onOpenChange: wrappedOnOpenChange,
      } as P,
      <>
        {children}
        {useCommands && (
          <CommandItemsForComboBox {...(rest as CommandsProps)} />
        )}

        {useButtonAddNew && resolvedMeta.task && (
          <>
            <Separator />
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between px-2 py-1.5 text-sm cursor-pointer"
              onClick={(e) =>
                onAddNewItem?.({
                  e,
                  apiEndpoint: resolvedMeta.apiEndpoint,
                  task: resolvedMeta.task,
                  dataReshapeFn: resolvedMeta.dataReshapeFn,
                })
              }
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
