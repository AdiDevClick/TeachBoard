import withController from "@/components/HOCs/withController.tsx";
import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { NonLabelledGroupItem } from "@/components/Selects/non-labelled-item/NonLabelledGroupItem.tsx";
import type {
  ForControllerVerticalFieldSelectProps,
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
  type ComponentType,
} from "react";

const emptyHandle: VerticalRefSetters = {
  props: {},
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
    role,
    task,
    apiEndpoint,
    dataReshapeFn,
    placeholder,
    controllerMeta,
    ...selectRootProps
  } = props;

  const id = useId();
  const [state, setState] = useState<VerticalFieldState>({});
  const lastSelectedValueRef = useRef<string>(null);
  const lastCommandValueRef = useRef<string>(null);
  const handleObjectRef = useRef<VerticalRefSetters>(emptyHandle);

  useImperativeHandle(controllerRef ?? ref, () => handleObjectRef.current);

  const fieldName = controllerMeta?.controllerName;
  const metaBase = {
    task,
    apiEndpoint,
    dataReshapeFn,
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
            "max-w-70.5 [&_[data-slot=select-value]]:block [&_[data-slot=select-value]]:truncate",
          )}
          size="default"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          side={side}
          className="w-[var(--radix-select-trigger-width)]"
        >
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}

function withListings<C extends object>(Wrapped: ComponentType<C>) {
  return function Component(props: C & PropsWithListings<unknown>) {
    if (listMapperContainsInvalid(props)) {
      debugLogs("withListings for VerticalFieldSelect");
      const { children, ...rest } = props;

      return <Wrapped {...(rest as C)}>{children}</Wrapped>;
    }
    const { items, children, ...rest } = props;
    return (
      <Wrapped {...(rest as C)}>
        <ListMapper items={items}>
          <NonLabelledGroupItem />
        </ListMapper>
        {children}
      </Wrapped>
    );
  };
}

export default VerticalFieldSelect;

function forController<P>(WrapperComponent: ComponentType<P>) {
  return function Component(props: P & ForControllerVerticalFieldSelectProps) {
    const { field, fieldState, ...rest } = props;
    const { onValueChange, ...restProps } = rest;

    const handleValueChange = (value: string, ...args: unknown[]) => {
      field.onChange(value);
      onValueChange?.(value, ...args);
    };

    return (
      <WrapperComponent
        {...(restProps as P)}
        value={field.value ?? ""}
        onValueChange={handleValueChange}
        aria-invalid={fieldState.invalid}
        controllerMeta={{ controllerName: field.name }}
      />
    );
  };
}

const VerticalFieldSelectForController = forController(VerticalFieldSelect);

export const VerticalFieldSelectWithController = withController(
  VerticalFieldSelectForController,
);
export const VerticalFieldSelectWithListings =
  withListings(VerticalFieldSelect);

export const VerticalFieldSelectWithControllerAndInlineSwitch = withController(
  forController(
    withInlineItemAndSwitchSelection(VerticalFieldSelectWithListings),
  ),
);
export const VerticalFieldWithInlineSwitchList = withListMapper(
  VerticalFieldSelectWithControllerAndInlineSwitch,
);
