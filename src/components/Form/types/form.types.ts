import type { SimpleAvatarListProps } from "@/components/Avatar/types/avatar.types.ts";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";
import type { PropsWithChildren } from "react";
import type {
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
  FieldErrors,
} from "react-hook-form";

/** Props for AvatarListWithLabelAndAddButton component */
export type AvatarListWithLabelAndAddButtonProps = SimpleAvatarListProps & {
  label?: string;
} & SimpleAddButtonWithToolTipProps;

/**
 * Props for FormWithDebug component
 */
export type FormWithDebugProps = Readonly<
  {
    formId: string;
    form: UseFormReturn<FieldValues>;
    className?: string;
    /** Calls a handler when the form is submitted and is valid */
    onValidSubmit?: SubmitHandler<FieldValues>;
    /** Calls a handler when the form is submitted and is invalid */
    onInvalidSubmit?:
      | SubmitErrorHandler<FieldValues>
      | ((e: FieldErrors<FieldValues>) => void);
  } & PropsWithChildren
>;
