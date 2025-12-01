import { CommandItems } from "@/components/Command/CommandItems.tsx";
import type { CommandsProps } from "@/components/Command/types/command.types.ts";
import { WithController } from "@/components/Controller/AppController.tsx";
import { WithListMapper } from "@/components/Lists/ListMapper.tsx";
import { SelectItemWithIcon } from "@/components/Selects/select-item-with-icon/SelectItemWithIcon.tsx";
import type {
  VerticalRefSetters,
  VerticalSelectProps,
} from "@/components/Selects/types/select.types.ts";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnyComponentLike } from "@/utils/types/types.utils.ts";
import { cn } from "@/utils/utils";
import {
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from "react";

const emptyHandle: VerticalRefSetters = {
  props: {} as ComponentProps<typeof Select>,
  getMeta: () => undefined,
  getLastSelectedItemValue: () => null,
};

/**
 * A card-like select field with vertical layout on selection options.
 *
 * @param ref - Ref object to access the select component's props
 * @param label - Label for the select field
 * @param placeholder - Placeholder text for the select field
 * @param fullWidth - Whether the select field should take full width
 * @param className - Additional class names for the container
 * @param children - Allow consumers to pass SelectItem / SelectGroup etc... to be rendered inside the select field
 * @param props - Additional props for the Select component
 */
export function VerticalFieldSelect({
  ref,
  controllerRef,
  label,
  placeholder,
  fullWidth = true,
  className,
  side = "bottom",
  setRef,
  observedRefs,
  id: containerId,
  ...props
}: VerticalSelectProps) {
  const id = useId();
  const [, setState] = useState<{ containerId?: string; open?: boolean }>({});

  const lastSelectedValueRef = useRef<string>(null);

  const { onOpenChange, onValueChange, children, defaultValue, ...rest } =
    props;

  const fieldName = (rest as unknown as { field?: { name?: string } })?.field
    ?.name;

  const handleObjectRef = useRef<VerticalRefSetters>(emptyHandle);

  useImperativeHandle(controllerRef ?? ref, () => handleObjectRef.current, [
    onOpenChange,
  ]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setState({ containerId, open });
        handleObjectRef.current = {
          props,
          getMeta: () => observedRefs?.get(containerId)?.meta ?? undefined,
          getLastSelectedItemValue: () => lastSelectedValueRef.current,
        };

        if (controllerRef) controllerRef.current = handleObjectRef.current;
      } else {
        setState({});
        handleObjectRef.current = emptyHandle;
        if (controllerRef?.current === handleObjectRef.current)
          controllerRef.current = null;
      }

      onOpenChange?.(open);
    },
    [containerId, props, observedRefs, fieldName, onOpenChange]
  );

  // wrap onValueChange to keep track of last clicked/selected item and expose it via the imperative handle
  const handleValueChange = (value?: string) => {
    lastSelectedValueRef.current = value ?? null;
    if (typeof value === "string") onValueChange?.(value);
  };

  return (
    <div
      id={containerId}
      ref={(el) => {
        setRef?.(el, {
          task: props?.task,
          apiEndpoint: props?.apiEndpoint,
          name: fieldName,
          id: containerId,
        });
      }}
      className={cn("flex flex-col items-start gap-2", className)}
    >
      {label && (
        <Label className="w-full" htmlFor={id}>
          {label}
        </Label>
      )}

      <Select
        defaultValue={defaultValue}
        onOpenChange={handleOpenChange}
        onValueChange={handleValueChange}
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
  return function Component<T extends CommandsProps>(
    props: T & VerticalSelectProps
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

    const apiEndpoint = props.apiEndpoint;
    const task = props.task;

    return (
      <Wrapped {...rest}>
        {useCommands && (
          <CommandItems commandHeadings={commandHeadings ?? []} {...rest} />
        )}
        {useButtonAddNew && (
          <SelectItemWithIcon
            value={task}
            selectText={creationButtonText}
            onPointerDown={(e) => onAddNewItem?.({ e, apiEndpoint, task })}
          />
        )}
        {children}
      </Wrapped>
    );
  };
}

export default VerticalFieldSelect;

export const VerticalFieldSelectWithController: ReturnType<
  typeof WithController<typeof VerticalFieldSelect>
> = WithController(VerticalFieldSelect);

export const VerticalFieldSelectWithCommands =
  withCommands(VerticalFieldSelect);

export const VerticalFieldSelectWithControlledCommands: ReturnType<
  typeof WithController<typeof VerticalFieldSelectWithCommands>
> = WithController(VerticalFieldSelectWithCommands);

export const VerticalFieldSelectWithControllerAndCommandsList: ReturnType<
  typeof WithListMapper<typeof VerticalFieldSelectWithControlledCommands>
> = WithListMapper(VerticalFieldSelectWithControlledCommands);
