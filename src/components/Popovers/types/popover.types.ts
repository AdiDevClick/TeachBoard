import type {
  CommandItemType,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import type { VerticalSelectProps } from "@/components/Selects/types/select.types.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import type { BivariantCallback } from "@/utils/types/types.utils.ts";
import type { ButtonProps } from "react-day-picker";

export type PopoverBaseProps = Omit<
  VerticalSelectProps,
  "side" | "onOpenChange" | "onSelect" | "onValueChange" | "value"
> & {
  side?: "top" | "bottom" | "left" | "right";
  role?: ButtonProps["role"];
  onOpenChange?: (open: boolean, meta?: MetaDatasPopoverField) => void;
  /** When this key changes, the selectedValue state will be reset */
  resetKey?: string | number;
};

export type PopoverSingleValue = string | undefined;

export type PopoverMultiValue = string[] | Set<string> | undefined;

export type PopoverSelectionValue = PopoverSingleValue | PopoverMultiValue;

export type PopoverSingleSelectionProps = {
  multiSelection?: false;
  value?: string;
  onValueChange?: (value: PopoverSelectionValue, ...args: unknown[]) => void;
};

export type PopoverMultiSelectionProps = {
  multiSelection: true;
  value?: string[] | Set<string>;
  onValueChange?: (value: PopoverSelectionValue, ...args: unknown[]) => void;
};

export type PopoverSelectionProps =
  | PopoverSingleSelectionProps
  | PopoverMultiSelectionProps;

export type PopoverCommandProps = {
  /**
   * Callback invoked when a command item is selected.
   * Bivariant to allow passing richer item subtypes (e.g. DetailedCommandItem).
   */
  onSelect?: BivariantCallback<
    (value: string, commandItem: CommandItemType) => void
  >;
  /** Headings provided to Command items when using command lists */
  commandHeadings?: HeadingType[];
};

/** Props spécifiques au PopoverField */
export type PopoverFieldProps = PopoverBaseProps &
  PopoverSelectionProps &
  PopoverCommandProps;

export type PopoverFieldState = {
  open: boolean;
  selectedValue?: PopoverSelectionValue;
  fieldName?: string;
};

export type MetaDatasPopoverField = CommandHandlerFieldMeta;
