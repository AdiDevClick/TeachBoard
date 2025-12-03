import { CommandItems } from "@/components/Command/CommandItems.tsx";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import type { PopoverFieldProps } from "@/components/Popovers/PopoverField.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { AnyComponentLike } from "@/utils/types/types.utils.ts";
import { PlusIcon } from "lucide-react";

/**
 * HOC to add CommandItems and an optional "Add New" button to a component.
 *
 * @param Wrapped - The component to be wrapped with command functionalities.
 */
function withCommands(Wrapped: AnyComponentLike) {
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
        {useCommands && (
          <CommandItems commandHeadings={commandHeadings ?? []} {...rest} />
        )}
        {useButtonAddNew && task && (
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between px-2 py-1.5 text-sm cursor-pointer"
            onClick={() => onAddNewItem?.({ apiEndpoint: apiEndpoint!, task })}
          >
            <span>{creationButtonText}</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
        {children}
      </Wrapped>
    );
  };
}

export default withCommands;
