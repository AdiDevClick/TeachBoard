import type { SimpleAvatarListProps } from "@/components/Avatar/types/avatar.types.ts";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";
import type { PropsWithChildren } from "react";
import type {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

/** Props for AvatarListWithLabelAndAddButton component */
export type AvatarListWithLabelAndAddButtonProps = SimpleAvatarListProps & {
  label?: string;
} & SimpleAddButtonWithToolTipProps;

/**
 * Props for FormWithDebug component
 */
export type FormWithDebugProps<T extends FieldValues> = Readonly<
  {
    formId: string;
    form: UseFormReturn<T>;
    className?: string;
    /** Calls a handler when the form is submitted and is valid */
    onValidSubmit: SubmitHandler<T>;
    /** Calls a handler when the form is submitted and is invalid */
    onInvalidSubmit: (e: FieldErrors<T>) => void;
  } & PropsWithChildren
>;
