import withController from "@/components/HOCs/withController.tsx";

import type {
  VerticalFieldState,
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
  setLastSelectedItemValue: (value: string) => value,
  getLastCommandValue: () => null,
  setLastCommandValue: (value: string) => value,
  setVerticalFieldOpen: () => {},
  setSelectedValue: () => {},
  setState: () => {},
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
  // placeholder,
  fullWidth = true,
  className,
  side = "bottom",
  setRef,
  observedRefs,
  id: containerId,
  ...props
}: VerticalSelectProps) {
  const { onOpenChange, onValueChange, children, defaultValue, role, ...rest } =
    props;

  const id = useId();
  const [state, setState] = useState<VerticalFieldState>({});
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  const lastSelectedValueRef = useRef<string>(null);
  const lastCommandValueRef = useRef<string | null>(null);
  const handleObjectRef = useRef<VerticalRefSetters>(emptyHandle);

  useImperativeHandle(controllerRef ?? ref, () => handleObjectRef.current);

  const fieldName = (rest as unknown as { field?: { name?: string } })?.field
    ?.name;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        console.log("oponChange in Vertical Select");
        handleObjectRef.current = {
          props,
          // setState: setVerticalStateCallback,
          state,
          getMeta: () => observedRefs?.get(containerId)?.meta ?? undefined,
          getLastSelectedItemValue: () => lastSelectedValueRef.current,
          setLastSelectedItemValue: (value: string) => {
            lastSelectedValueRef.current = value;
          },
          getLastCommandValue: () => lastCommandValueRef.current,
          setLastCommandValue: (value: string) => {
            lastCommandValueRef.current = value;
          },
          // setVerticalFieldOpen: setVerticalStateCallback,
          // setSelectedValue: setSelectedValueCallback,
          // setVerticalState: setVerticalStateCallback,
        };
        setState({ containerId, open });

        if (controllerRef) controllerRef.current = handleObjectRef.current;
      } else {
        console.log("ELSE => RESET DU VERTICAL STATE");
        setState({});
        handleObjectRef.current = emptyHandle;
        if (controllerRef?.current === handleObjectRef.current)
          controllerRef.current = null;
      }

      onOpenChange?.(open);
      // }, []);
    },
    [
      containerId,
      props,
      observedRefs,
      controllerRef,
      onOpenChange,
      onValueChange,
      handleObjectRef,
    ]
  );

  // wrap onValueChange to keep track of last clicked/selected item and expose it via the imperative handle
  const handleValueChange = (value?: string) => {
    console.log("Vertical value changed => ", value);
    lastSelectedValueRef.current = value ?? null;
    lastCommandValueRef.current = value ?? null;

    handleObjectRef.current = {
      ...handleObjectRef.current,
      getLastSelectedItemValue: () => value,
      getLastCommandValue: () => lastCommandValueRef.current,
    };
    if (typeof value === "string") onValueChange?.(value);
  };

  // console.log(props?.onSelect(), "PROPS ON SELECT");
  const buttonValue =
    handleObjectRef.current.getLastSelectedItemValue?.() ?? "";
  console.log(state.command, "STATE COMMAND", controllerRef?.current?.state);
  return (
    <div
      id={containerId}
      ref={(el) => {
        setRef?.(el, {
          task: props?.task,
          apiEndpoint: props?.apiEndpoint,
          dataReshapeFn: props?.dataReshapeFn,
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
        // open={state.open}
        // value={props?.onSelect}
        defaultValue={defaultValue}
        onOpenChange={handleOpenChange}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          id={id}
          role={role}
          {...rest}
          className={cn(fullWidth ? "w-full" : "w-fit")}
          size="default"
        >
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent side={side}>{children}</SelectContent>
      </Select>
    </div>
  );
}

// function withCommands(Wrapped: AnyComponentLike) {
//   return function Component<T extends CommandsProps>(
//     props: T & VerticalSelectProps
//   ) {
//     const {
//       useCommands,
//       children,
//       creationButtonText,
//       useButtonAddNew,
//       onAddNewItem,
//       commandHeadings,
//       ...rest
//     } = props;

//     const apiEndpoint = props.apiEndpoint;
//     const task = props.task;
//     const dataReshapeFn = props.dataReshapeFn;

//     return (
//       <Wrapped {...rest}>
//         {useCommands && (
//           <CommandItemsForComboBox
//             commandHeadings={commandHeadings ?? []}
//             {...rest}
//           />
//         )}
//         {useButtonAddNew && (
//           <InertSelectItemWithIcon
//             value={task}
//             inertIconText={creationButtonText}
//             onPointerDown={(e) =>
//               onAddNewItem?.({ e, apiEndpoint, task, dataReshapeFn })
//             }
//           />
//         )}
//         {children}
//       </Wrapped>
//     );
//   };
// }

export default VerticalFieldSelect;

export const VerticalFieldSelectWithController: ReturnType<
  typeof withController<typeof VerticalFieldSelect>
> = withController(VerticalFieldSelect);

// export const VerticalFieldSelectWithCommands =
//   withCommands(VerticalFieldSelect);

// export const VerticalFieldSelectWithControlledCommands: ReturnType<
//   typeof withController<typeof VerticalFieldSelectWithCommands>
// > = withController(VerticalFieldSelectWithCommands);

// export const VerticalFieldSelectWithControllerAndCommandsList: ReturnType<
//   typeof withListMapper<typeof VerticalFieldSelectWithControlledCommands>
// > = withListMapper(VerticalFieldSelectWithControlledCommands);
