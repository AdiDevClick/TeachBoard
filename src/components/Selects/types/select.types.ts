import type { DataReshapeFn } from "@/components/Inputs/types/inputs.types.ts";
import type {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";
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

/** State type for VerticalFieldSelect */
export type VerticalFieldState = {
  containerId?: string;
  open?: boolean;
  command?: boolean;
};

export type VerticalRefSetters = {
  /** Underlying props for the select */
  props: ComponentProps<typeof Select>;
  /** Metadatas from the component and wrapped HOCs (eg: task, apiEndpoint, name, id, etc.) */
  getMeta: () => Record<string, unknown> | undefined;
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

/**
 * Props for the VerticalFieldSelect component
 * {@link VerticalFieldSelect}
 */
export type VerticalSelectProps = Omit<
  ComponentProps<typeof Select>,
  "form"
> & {
  ref?: Ref<VerticalRefSetters>;
  controllerRef?: Ref<VerticalRefSetters>;
  observedRefs?: UniqueSet<
    string,
    { element: Element; meta?: Record<string, unknown> }
  >;
  task?: string;
  dataReshapeFn?: DataReshapeFn;
  apiEndpoint?: string;
  label?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  side?: ComponentProps<typeof SelectContent>["side"];
  setRef?: (node?: Element | null, meta?: Record<string, unknown>) => void;
  id?: string;
} & PropsWithChildren;

type LabelledGroupBaseProps<T> = {
  readonly ["0"]: string;
  readonly ["1"]: T[];
};

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
export type NonLabelledGroupItemProps = {
  id?: string;
  name?: string;
};

/**
 * Props for the SelectItemWithIcon component
 */
export type ButtonItemWithIconProps = {
  // value: string;
  inertIconText: ReactNode | string;
  // modalName?: AppModalNames;
} & PropsWithChildren;
// export type SelectItemWithIconProps = ComponentProps<typeof SelectItem> & {
//   value: string;
//   selectText: ReactNode | string;
//   modalName?: AppModalNames;
// };

export type HandleAddNewParams = {
  e: PointerEvent<HTMLDivElement>;
  setSelected: Dispatch<SetStateAction<boolean>>;
};

export type InertSelectItemProps = ComponentProps<typeof SelectItem>;
