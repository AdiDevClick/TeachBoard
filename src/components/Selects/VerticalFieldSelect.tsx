import withController from "@/components/HOCs/withController.tsx";
import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import type {
  PropsWithListings,
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
import {
  debugLogs,
  listMapperContainsInvalid,
} from "@/configs/app-components.config.ts";
import { cn } from "@/utils/utils";
import {
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
} from "react";

const emptyHandle: VerticalRefSetters = {
  props: {} as ComponentProps<typeof Select>,
  getMeta: () => undefined,
  getLastSelectedItemValue: () => null,
  setLastSelectedItemValue: (value: string) => value,
  getLastCommandValue: () => null,
  setLastCommandValue: (value: string) => value,
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
  triggerProps,
  ...props
}: VerticalSelectProps) {
  const {
    onOpenChange,
    onValueChange,
    children,
    defaultValue,
    role,
    task,
    apiEndpoint,
    dataReshapeFn,
    placeholder,
    field,
    fieldState,
    controllerMeta,
    ...selectRootProps
  } = props as VerticalSelectProps & {
    field?: { name?: string };
    fieldState?: unknown;
    controllerMeta?: unknown;
  };

  const id = useId();
  const [state, setState] = useState<VerticalFieldState>({});
  const lastSelectedValueRef = useRef<string>(null);
  const lastCommandValueRef = useRef<string>(null);
  const handleObjectRef = useRef<VerticalRefSetters>(emptyHandle);

  useImperativeHandle(controllerRef ?? ref, () => handleObjectRef.current);

  const fieldName = field?.name;
  const metaBase = {
    task,
    apiEndpoint,
    dataReshapeFn,
    field,
    fieldState,
    controllerMeta,
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        handleObjectRef.current = {
          ...emptyHandle,
          props: selectRootProps,
          getMeta: () =>
            containerId
              ? (observedRefs?.get(containerId)?.meta ?? undefined)
              : undefined,
          getLastSelectedItemValue: () => lastSelectedValueRef.current,
          setLastSelectedItemValue: (value: string) => {
            lastSelectedValueRef.current = value;
          },
          getLastCommandValue: () => lastCommandValueRef.current,
          setLastCommandValue: (value: string) => {
            lastCommandValueRef.current = value;
          },
          setVerticalState: setState,
        };
        setState({ containerId, open });
      } else {
        setState({});
        handleObjectRef.current = emptyHandle;
      }

      onOpenChange?.(open);
      // }, []);
    },
    [containerId, selectRootProps, observedRefs, onOpenChange],
  );

  // wrap onValueChange to keep track of last clicked/selected item and expose it via the imperative handle
  const handleValueChange = (value: string) => {
    lastSelectedValueRef.current = value;
    lastCommandValueRef.current = value;

    handleObjectRef.current = {
      ...handleObjectRef.current,
      getLastSelectedItemValue: () => value,
      getLastCommandValue: () => lastCommandValueRef.current,
    };
    const allDetails = containerId ? observedRefs?.get(containerId) : undefined;
    const metas = allDetails
      ? { ...selectRootProps, ...metaBase, ...allDetails.meta }
      : { ...selectRootProps, ...metaBase };
    onValueChange?.(value, metas);
  };

  return (
    <div
      id={containerId}
      data-open={state.open}
      ref={(el) => {
        setRef?.(el, {
          task,
          apiEndpoint,
          dataReshapeFn,
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
        {...selectRootProps}
      >
        <SelectTrigger
          id={id}
          role={role}
          {...triggerProps}
          className={cn(
            fullWidth ? "w-full" : "w-fit",
            triggerProps?.className,
          )}
          size="default"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side={side}>{children}</SelectContent>
      </Select>
    </div>
  );
}

function withListings<TProps extends object, TItem = unknown>(
  Wrapped: ComponentType<TProps>,
) {
  return function Component(props: TProps & PropsWithListings<TItem>) {
    if (listMapperContainsInvalid(props)) {
      debugLogs("withListings for VerticalFieldSelect");
      return <Wrapped {...(props as TProps)}>{props.children}</Wrapped>;
    }
    const { items, ...rest } = props;
    return (
      <Wrapped {...(rest as TProps)}>
        <ListMapper items={items}>
          <NonLabelledGroupItem />
        </ListMapper>
        {props.children}
      </Wrapped>
    );
  };
}

export default VerticalFieldSelect;

export const VerticalFieldSelectWithController =
  withController(VerticalFieldSelect);

type VerticalFieldSelectListingsComponent = ComponentType<
  VerticalSelectProps & PropsWithListings<unknown>
>;

export const VerticalFieldSelectWithListings = withListings(
  VerticalFieldSelect,
) as VerticalFieldSelectListingsComponent;

export const VerticalFieldSelectWithControllerAndInlineSwitch = withController(
  withInlineItemAndSwitchSelection(VerticalFieldSelectWithListings),
) as ComponentType<Record<string, unknown>>;

export const VerticalFieldWithInlineSwitchList = withListMapper(
  VerticalFieldSelectWithControllerAndInlineSwitch,
) as ComponentType<Record<string, unknown>>;
