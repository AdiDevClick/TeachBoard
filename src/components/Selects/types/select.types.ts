import type { UUID } from "@/api/types/openapi/common.types";
import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/components/Inputs/types/inputs.types.ts";
import type { SelectContent, SelectItem } from "@/components/ui/select.tsx";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types.ts";
import type { FieldTypes } from "@/types/MainTypes";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { UniqueSet } from "@/utils/UniqueSet";
import type {
  ComponentProps,
  Dispatch,
  PointerEvent,
  PropsWithChildren,
  ReactNode,
  Ref,
  SetStateAction,
} from "react";
import type { FieldValues } from "react-hook-form";

/** State type for VerticalFieldSelect */
export type VerticalFieldState = {
  containerId?: string;
  open?: boolean;
  command?: boolean;
};

export type SelectRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  dir?: "ltr" | "rtl";
};

export type VerticalRefSetters = {
  /** Underlying props for the select */
  props: SelectRootProps;
  /** Metadatas from the component and wrapped HOCs (eg: task, apiEndpoint, name, id, etc.) */
  getMeta: () => VerticalSelectMetaData | undefined;
  /** Last selected item value (may be undefined) */
  getLastSelectedItemValue: () => unknown;
  /** Set the last selected item value */
  setLastSelectedItemValue: (value: string) => void;
  /** Last command value from CommandItems (may be null) */
  getLastCommandValue: () => string | null;
  /** Set the last command value */
  setLastCommandValue: (value: string) => void;
  /** Set the open state of the vertical field select */
  setVerticalFieldOpen?: Dispatch<SetStateAction<VerticalFieldState>>;
  /** Set the selected value */
  setSelectedValue?: (value: string) => void;
  /** Set the vertical field state */
  setVerticalState?: Dispatch<SetStateAction<VerticalFieldState>>;
};
type ControllerMeta = { controllerName?: string };

/**
 * EXTERNAL HANDLER - VERTICAL FIELD SELECT
 *
 * @description Enriched metadata passed to external handlers so you can have all the necessary information to handle the select's opening and selection logic in one place.
 */
export type VerticalSelectMetaData = CommandHandlerFieldMeta &
  Partial<Omit<SelectRootProps, "onValueChange">> & {
    controllerMeta?: ControllerMeta;
  };

/**
 * Props for the VerticalFieldSelect component
 * {@link VerticalFieldSelect}
 */
export type VerticalSelectProps = Omit<SelectRootProps, "onValueChange"> & {
  ref?: Ref<VerticalRefSetters>;
  controllerRef?: Ref<VerticalRefSetters>;
  observedRefs?: UniqueSet<
    string,
    { element: Element; meta?: VerticalSelectMetaData }
  >;
  controllerMeta?: ControllerMeta;
  task?: AppModalNames;
  dataReshapeFn?: DataReshapeFn;
  apiEndpoint?: ApiEndpointType;
  label?: ReactNode;
  placeholder?: string;
  /** Forwarded to the SelectTrigger element */
  role?: string;
  /** Extra props forwarded to the SelectTrigger element */
  triggerProps?: ComponentProps<"button">;
  fullWidth?: boolean;
  className?: string;
  side?: ComponentProps<typeof SelectContent>["side"];
  setRef?: (node?: Element | null, meta?: VerticalSelectMetaData) => void;
  id?: UUID | string;
  /**
   * Allow value-change handlers that accept extra args.
   * The underlying Select will still call it with a single `value`.
   */
  onValueChange?: (value: string, meta?: VerticalSelectMetaData) => void;
} & PropsWithChildren;

type LabelledGroupBaseProps<T> = {
  readonly ["0"]: string;
  readonly ["1"]: T[];
};

export type PropsWithListings<T> = {
  items: T[];
} & PropsWithChildren;

export type ForControllerVerticalFieldSelectProps = FieldTypes<FieldValues> &
  Pick<VerticalSelectProps, "onValueChange">;

/**
 * Props for the LabelledGroup component
 *
 * @description This component can be used in two modes:
 * - Direct props mode: pass a tuple with the group name and items array.
 * - ListMapper mode: use SafeListMapperProp to map over items.
 */
export type LabelledGroupProps<T = Record<string, unknown>> =
  PropsWithChildren &
    (LabelledGroupBaseProps<T> | SafeListMapperProp<LabelledGroupBaseProps<T>>);

/**
 * Props for the NonLabelledGroupItem component
 */
export type NonLabelledGroupItemProps = Readonly<{
  id?: UUID | string;
  name: string;
}>;

/**
 * Props for the SelectItemWithIcon component
 */
export type ButtonItemWithIconProps = {
  inertIconText: ReactNode | string;
} & PropsWithChildren;

export type HandleAddNewParams = {
  e: PointerEvent<HTMLDivElement>;
  setSelected: Dispatch<SetStateAction<boolean>>;
};

export type InertSelectItemProps = ComponentProps<typeof SelectItem>;
