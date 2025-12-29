import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import type { VerticalSelectProps } from "@/components/Selects/types/select.types.ts";
import type { ButtonProps } from "react-day-picker";

/** Props spécifiques au PopoverField */
export type PopoverFieldProps = Omit<
  VerticalSelectProps,
  "side" | "onOpenChange"
> & {
  side?: "top" | "bottom" | "left" | "right";
  onSelect?: (value: string, commandItem?: CommandItemType) => void;
  role?: ButtonProps["role"];
  /** Allows multiple selections inside the popover list items if set to true */
  multiSelection?: boolean;
  /** Called when the popover opens or closes. Receives the open state and the meta data. */
  onOpenChange?: (open: boolean, meta?: Record<string, unknown>) => void;
  /** When this key changes, the selectedValue state will be reset */
  resetKey?: string | number;
};

export type PopoverFieldState = {
  open: boolean;
  selectedValue?: Set<string> | string;
  fieldName?: string;
};
