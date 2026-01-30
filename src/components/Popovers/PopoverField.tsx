import { PopoverFieldProvider } from "@/api/providers/Popover.provider.tsx";
import withComboBoxCommands from "@/components/HOCs/withComboBoxCommands";
import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type {
  PopoverFieldProps,
  PopoverFieldState,
} from "@/components/Popovers/types/popover.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/utils/utils.ts";
import { LucideChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

const defaultValue = new Set<string>();

/**
 * Popover Field component
 *
 * @description A field that opens a popover with selectable options.
 *
 * @param label - The label for the field.
 * @param placeholder - The placeholder text when no option is selected.
 * @param fullWidth - Whether the field should take the full width of its container.
 * @param className - Additional class names for the container.
 * @param side - The side where the popover should appear.
 * @param setRef - A callback to set the ref of the container.
 * @param containerId - The id for the container element.
 * @param props - Additional props for the PopoverField.
 */
export function PopoverField({
  label,
  placeholder = "Sélectionnez...",
  fullWidth = true,
  className,
  side = "bottom",
  setRef,
  id: containerId,
  resetKey,
  ...props
}: PopoverFieldProps) {
  const { onOpenChange, children, role, ...rest } = props;

  const id = useId();

  const [state, setState] = useState<PopoverFieldState>({
    open: false,
    fieldName: rest?.name,
    selectedValue: props.multiSelection
      ? defaultValue
      : rest.defaultValue ?? undefined,
  });

  // Reset selectedValue when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      setState((prev) => ({
        ...prev,
        selectedValue: props.multiSelection ? defaultValue : undefined,
      }));
    }
  }, [resetKey, props.multiSelection]);

  // Meta data for this field instance
  const memoizedMeta = useMemo(
    () => ({
      task: rest?.task ?? "none",
      apiEndpoint: rest?.apiEndpoint,
      dataReshapeFn: rest?.dataReshapeFn,
      name: state.fieldName,
      id: containerId,
    }),
    [
      rest?.task,
      rest?.apiEndpoint,
      rest?.dataReshapeFn,
      state.fieldName,
      containerId,
    ]
  );

  /**
   * Callback to handle selection of a value
   *
   * !! IMPORTANT !! This function is passed to the PopoverFieldProvider to be used in CommandItems.
   */
  const setSelectedValueCallback = useCallback((value: string) => {
    if (props.multiSelection) {
      setState((prev) => {
        const newSet = new Set(prev.selectedValue);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        return { ...prev, selectedValue: newSet };
      });
    } else {
      setState((prev) => ({ ...prev, selectedValue: value, open: false }));
    }
  }, []);

  /**
   * Handle open state changes
   *
   * @description This intercepts the onOpenChange from the Popover to also pass the meta data.
   *
   * @param isOpen - Whether the popover is open or not
   */
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setState((prev) => ({ ...prev, open: isOpen }));
      onOpenChange?.(isOpen, memoizedMeta);
    },
    [onOpenChange, memoizedMeta]
  );

  const selectValue = props.multiSelection
    ? placeholder
    : state.selectedValue ?? placeholder;

  return (
    <div
      id={containerId}
      ref={(el) => setRef?.(el, memoizedMeta)}
      className={cn("flex flex-col items-start gap-2", className)}
    >
      {label && (
        <Label className="w-full" htmlFor={id}>
          {label}
        </Label>
      )}

      <Popover open={state.open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role={role}
            className={cn(
              "justify-between",
              fullWidth ? "w-full" : "w-fit",
              state.selectedValue
                ? "font-normal"
                : "text-muted-foreground font-normal"
            )}
          >
            {selectValue}
            <LucideChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} className="p-0">
          <PopoverFieldProvider
            onSelect={setSelectedValueCallback}
            selectedValue={state.selectedValue}
          >
            {children}
          </PopoverFieldProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default PopoverField;

export const PopoverFieldWithController = withController(PopoverField);

export const PopoverFieldWithCommands = withComboBoxCommands(PopoverField);

export const PopoverFieldWithControlledCommands = withController(
  PopoverFieldWithCommands
);

export const PopoverFieldWithControllerAndCommandsList = withListMapper(
  PopoverFieldWithControlledCommands
);
