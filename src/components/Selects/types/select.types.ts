import type {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type {
  ComponentProps,
  Dispatch,
  PointerEvent,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from "react";

/**
 * Props for the VerticalFieldSelect component
 * {@link VerticalFieldSelect}
 */
export type VerticalSelectProps = Omit<
  ComponentProps<typeof Select>,
  "form"
> & {
  label?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  side?: ComponentProps<typeof SelectContent>["side"];
  setRef?: (node?: HTMLElement) => void;
  id: string;
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
export type SelectItemWithIconProps = ComponentProps<typeof SelectItem> & {
  value: string;
  selectText: ReactNode | string;
  modalName?: AppModalNames;
};

export type HandleAddNewParams = {
  e: PointerEvent<HTMLDivElement>;
  setSelected: Dispatch<SetStateAction<boolean>>;
};
