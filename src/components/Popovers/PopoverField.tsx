import { PopoverFieldProvider } from "@/api/providers/Popover.provider.tsx";
import withCommands from "@/components/HOCs/withCommands.tsx";
import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type { VerticalSelectProps } from "@/components/Selects/types/select.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/utils/utils.ts";
import { LucideChevronDown } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";
import type { ButtonProps } from "react-day-picker";

/** Props spécifiques au PopoverField */
export type PopoverFieldProps = Omit<
  VerticalSelectProps,
  "side" | "onOpenChange"
> & {
  side?: "top" | "bottom" | "left" | "right";
  onSelect?: (value: string) => void;
  role?: ButtonProps["role"];
  /** Called when the popover opens or closes. Receives the open state and the meta data. */
  onOpenChange?: (open: boolean, meta?: Record<string, unknown>) => void;
};

/**
 * A popover-based field with Command support for searchable selections.
 * Similar to VerticalFieldSelect but uses Popover + Command instead of Select.
 */
export function PopoverField({
  label,
  placeholder = "Sélectionnez...",
  fullWidth = true,
  className,
  side = "bottom",
  setRef,
  id: containerId,
  ...props
}: PopoverFieldProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  const { onOpenChange, children, role, ...rest } = props;

  const fieldName = rest?.name;

  // Meta data for this field instance
  const memoizedMeta = useMemo(
    () => ({
      task: rest?.task,
      apiEndpoint: rest?.apiEndpoint,
      name: fieldName,
      id: containerId,
    }),
    [rest?.task, rest?.apiEndpoint, fieldName, containerId]
  );

  /**
   * Callback to handle selection of a value
   *
   * !! IMPORTANT !! This function is passed to the PopoverFieldProvider to be used in CommandItems.
   *
   * @description This function updates the selected value state and triggers the onSelect callback.
   * @param value - The selected value
   */
  const setSelectedValueCallback = useCallback((value: string) => {
    setSelectedValue(value);
    setOpen(false);
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
      setOpen(isOpen);
      onOpenChange?.(isOpen, memoizedMeta);
    },
    [onOpenChange, memoizedMeta]
  );

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

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role={role}
            className={cn("justify-between", fullWidth ? "w-full" : "w-fit")}
          >
            {selectedValue || placeholder}
            <LucideChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} className="p-0">
          <PopoverFieldProvider onSelect={setSelectedValueCallback}>
            {children}
          </PopoverFieldProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default PopoverField;

export const PopoverFieldWithController = withController(PopoverField);

export const PopoverFieldWithCommands = withCommands(PopoverField);

export const PopoverFieldWithControlledCommands = withController(
  PopoverFieldWithCommands
);

export const PopoverFieldWithControllerAndCommandsList = withListMapper(
  PopoverFieldWithControlledCommands
);
