import type {
  CommandItemType,
  HeadingType,
} from "@/components/Command/types/command.types.ts";
import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/components/Inputs/types/inputs.types.ts";
import type { VerticalSelectProps } from "@/components/Selects/types/select.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { BivariantCallback } from "@/utils/types/types.utils.ts";
import type { ButtonProps } from "react-day-picker";

/** Props spécifiques au PopoverField */
export type PopoverFieldProps = Omit<
  VerticalSelectProps,
  "side" | "onOpenChange"
> & {
  side?: "top" | "bottom" | "left" | "right";
  /**
   * Callback invoked when a command item is selected.
   * Bivariant to allow passing richer item subtypes (e.g. DetailedCommandItem).
   */
  onSelect?: BivariantCallback<
    (value: string, commandItem: CommandItemType) => void
  >;
  /** Headings provided to Command items when using command lists */
  commandHeadings?: HeadingType[];
  role?: ButtonProps["role"];
  /** Allows multiple selections inside the popover list items if set to true */
  multiSelection?: boolean;
  /** Optional API endpoint - reuse shared type from inputs */
  apiEndpoint?: ApiEndpointType;
  /** Optional data reshape function - reuse shared type from inputs */
  dataReshapeFn?: DataReshapeFn;
  /** Optional typed metadata passed when opening */
  task?: AppModalNames;
  onOpenChange?: (open: boolean, meta?: MetaDatasPopoverField) => void;
  /** When this key changes, the selectedValue state will be reset */
  resetKey?: string | number;
};

export type PopoverFieldState = {
  open: boolean;
  selectedValue?: Set<string> | string;
  fieldName?: string;
};

type MetaPopoverInputLike = {
  apiEndpoint?: ApiEndpointType;
  dataReshapeFn?: DataReshapeFn;
};

export type MetaDatasPopoverField<TInput = MetaPopoverInputLike> = Omit<
  HandleAddNewItemParams<TInput>,
  "e"
> & {
  name?: string;
  id?: string;
};
