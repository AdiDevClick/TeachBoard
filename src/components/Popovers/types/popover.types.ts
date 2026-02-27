import type { VerticalSelectProps } from "@/components/Selects/types/select.types.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import type { ButtonProps } from "react-day-picker";

export type PopoverBaseProps = Omit<
  VerticalSelectProps,
  "side" | "onSelect" | "onValueChange" | "value"
> & {
  side?: "top" | "bottom" | "left" | "right";
  role?: ButtonProps["role"];
  /** When this key changes, the selectedValue state will be reset */
  resetKey?: string | number;
};

export type PopoverSingleValue = string | undefined;

export type PopoverMultiValue = string[] | Set<string> | undefined;

export type PopoverSelectionValue = PopoverSingleValue | PopoverMultiValue;

export type PopoverSelectionProps = {
  /**
   * When truthy the popover allows selecting multiple values (the internal
   * representation is a `Set`).  Any boolean is accepted, which makes it easy
   * to pass through a variable or spread from other objects without narrowing.
   *
   * Optional: the field behaves as a regular single-selection popover when
   * the prop is omitted or falsy.  This matches the behaviour of the
   * implementation which treats the flag truthily.
   */
  multiSelection?: boolean;
};

/** Props spécifiques au PopoverField */
export type PopoverFieldProps = PopoverBaseProps & PopoverSelectionProps;

export type PopoverFieldState = {
  open: boolean;
  selectedValue?: PopoverSelectionValue;
  fieldName?: string;
};

export type MetaDatasPopoverField = CommandHandlerFieldMeta;
