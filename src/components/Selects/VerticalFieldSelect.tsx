import { WithController } from "@/components/Controller/AppController.tsx";
import { WithListMapper } from "@/components/Lists/ListMapper.tsx";
import { SelectItemWithIcon } from "@/components/Selects/select-item-with-icon/SelectItemWithIcon.tsx";
import type { VerticalSelectProps } from "@/components/Selects/types/select.types.ts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command.tsx";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnyComponentLike } from "@/utils/types/types.utils.ts";
import { cn, preventDefaultAndStopPropagation } from "@/utils/utils";
import { useId, type PointerEvent, type ReactNode, type Ref } from "react";

/**
 * A card-like select field with vertical layout on selection options.
 *
 * @param label - Label for the select field
 * @param placeholder - Placeholder text for the select field
 * @param fullWidth - Whether the select field should take full width
 * @param className - Additional class names for the container
 * @param children - Allow consumers to pass SelectItem / SelectGroup etc... to be rendered inside the select field
 * @param props - Additional props for the Select component
 */
export function VerticalFieldSelect({
  label,
  placeholder,
  fullWidth = true,
  className,
  side = "bottom",
  setRef,
  id: containerId,
  ...props
}: VerticalSelectProps) {
  const id = useId();

  const { onOpenChange, onValueChange, children, defaultValue, ...rest } =
    props;

  return (
    <div
      id={containerId}
      ref={setRef as Ref<HTMLDivElement>}
      data-inputcontrollername={rest.field?.name}
      className={cn("flex flex-col items-start gap-2", className)}
    >
      {label && (
        <Label className="w-full" htmlFor={id}>
          {label}
        </Label>
      )}

      <Select
        defaultValue={defaultValue}
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      >
        <SelectTrigger
          id={id}
          {...rest}
          className={cn(fullWidth ? "w-full" : "w-fit")}
          size="default"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent side={side}>{children}</SelectContent>
      </Select>
    </div>
  );
}

function withCommands(Wrapped: AnyComponentLike) {
  type CommandsProps = {
    useCommands?: boolean;
    creationButtonText?: ReactNode;
    task: string;
    apiEndpoint?: string;
    useButtonAddNew?: boolean;
    onAddNewItem?: (e: PointerEvent<HTMLDivElement>) => void;
  };

  return function Component<T extends CommandsProps>(
    props: T & VerticalSelectProps
  ) {
    const {
      useCommands,
      children,
      creationButtonText,
      task,
      apiEndpoint,
      useButtonAddNew,
      onAddNewItem,
      ...rest
    } = props;

    const handleAddNew = async (
      e: PointerEvent<HTMLDivElement>,
      task: string | undefined,
      apiEndpoint: string | undefined
    ) => {
      preventDefaultAndStopPropagation(e);
      if (!task || !apiEndpoint) return;
      console.log(e.target, task, apiEndpoint);
    };

    return (
      <Wrapped {...rest}>
        {useCommands && (
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup></CommandGroup>
            </CommandList>
          </Command>
        )}
        {useButtonAddNew && (
          <SelectItemWithIcon
            value={task}
            selectText={creationButtonText}
            onPointerDown={onAddNewItem}
          />
        )}
        {children}
      </Wrapped>
    );
  };
}

export default VerticalFieldSelect;

export const VerticalFieldSelectWithController =
  WithController(VerticalFieldSelect);

export const VerticalFieldSelectWithCommands =
  withCommands(VerticalFieldSelect);

export const VerticalFieldSelectWithControlledCommands = WithController(
  VerticalFieldSelectWithCommands
);

export const VerticalFieldSelectWithControllerAndCommandsList: ReturnType<
  typeof WithListMapper<typeof VerticalFieldSelectWithControlledCommands>
> = WithListMapper(VerticalFieldSelectWithControlledCommands);
