import { PopoverFieldProvider } from "@/api/providers/Popover.provider.tsx";
import { useFieldStore } from "@/api/store/FieldStore.ts";
import type { PopoverFieldProps } from "@/components/Popovers/types/popover.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/utils/utils.ts";
import { LucideChevronDown } from "lucide-react";
import { useEffect, useId, useState, type Ref } from "react";

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
  resetKey,
  setRef,
  id: containerId,
  onOpenChange,
  children,
  role,
  multiSelection,
  ...rest
}: PopoverFieldProps) {
  const { getValue, resetByKey, updateValue, setValue, resetValues } =
    useFieldStore(multiSelection, resetKey, rest.name);
  const [state, setState] = useState(false);

  const selectedValue = getValue(rest.defaultValue);

  const id = useId();

  useEffect(() => {
    if (resetKey !== undefined) {
      resetByKey(resetKey);
    }
  }, [resetKey, resetByKey]);

  /**
   * Callback to handle selection of a value
   *
   * !! IMPORTANT !! This function is passed to the PopoverFieldProvider to be used in CommandItems.
   */
  const setSelectedValueCallback = (nextValue: string) => {
    if (multiSelection) {
      updateValue(nextValue);
      return;
    }

    setValue(nextValue);
    setState(false);
  };

  /**
   * Handle open state changes
   *
   * @description This intercepts the onOpenChange from the Popover to also pass the meta data.
   *
   * @param isOpen - Whether the popover is open or not
   */
  const handleOpenChange = (isOpen: boolean) => {
    setState(isOpen);
    onOpenChange?.(isOpen);
  };

  useEffect(() => {
    return () => {
      resetValues();
    };
  }, [resetValues]);

  const selectValue = multiSelection
    ? placeholder
    : (selectedValue ?? placeholder);

  return (
    <div
      id={containerId}
      ref={(setRef ?? rest.ref) as Ref<HTMLDivElement>}
      className={cn("flex flex-col items-start gap-2", className)}
    >
      {label && (
        <Label className="w-full" htmlFor={id}>
          {label}
        </Label>
      )}

      <Popover open={state} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            role={role}
            className={cn(
              "justify-between",
              fullWidth ? "w-full" : "w-fit",
              selectedValue
                ? "font-normal"
                : "text-muted-foreground font-normal",
            )}
          >
            {selectValue}
            <LucideChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} className="p-0">
          <PopoverFieldProvider
            onSelect={setSelectedValueCallback}
            selectedValue={selectedValue}
          >
            {children}
          </PopoverFieldProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default PopoverField;
