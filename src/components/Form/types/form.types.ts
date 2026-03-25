import type { SimpleAvatarListProps } from "@/components/Avatar/types/avatar.types.ts";
import type { SimpleAddButtonWithToolTip } from "@/components/Buttons/exports/buttons.exports";
import type { Button } from "@/components/ui/button";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type { ComponentProps, PropsWithChildren } from "react";
import type {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

/** Props for AvatarListWithLabelAndAddButton component */
export type AvatarListWithLabelAndAddButtonProps = SimpleAvatarListProps & {
  label?: string;
  className?: string;
  onClick?: (
    payload: HandleAddNewItemParams &
      Omit<ComponentProps<typeof Button>, "onClick">,
  ) => void;
} & Omit<ComponentProps<typeof SimpleAddButtonWithToolTip>, "onClick">;

/**
 * Props for FormWithDebug component
 */
export type FormWithDebugProps<T extends FieldValues> = Readonly<
  {
    /** Delay in milliseconds before submitting the form */
    debounceDelay?: number;
    /** Unique identifier for the form, used for debugging and form management */
    formId: string;
    /** Form created by react-hook-form */
    form: UseFormReturn<T>;
    /** Any CSS style for the form */
    className?: string;
    /** Unique identifier for the page, used for debugging and form management */
    pageId: string;
    /** Calls a handler when the form is submitted and is valid */
    onValidSubmit: SubmitHandler<T>;
    /** Calls a handler when the form is submitted and is invalid */
    onInvalidSubmit: (e: FieldErrors<T>) => void;
  } & PropsWithChildren &
    UseMutationObserverReturn
>;
