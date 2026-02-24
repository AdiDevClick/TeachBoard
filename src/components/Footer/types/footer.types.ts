import type { DialogFooter } from "@/components/ui/dialog.tsx";
import type { ComponentProps } from "react";
import type { FormState } from "react-hook-form";

export type AppDialFooterProps = Readonly<
  {
    /** Text for the cancel button */
    cancelText?: string;
    /** An object containing text for the submit button */
    submitText?: string;
    /** The form state object to determine if the form is valid */
    formState?: FormState<any>;
    /** The id of the form to be submitted */
    formId?: string;
    /** Whether to display the submit button */
    displaySubmitButton?: boolean;
    /** Whether to display the cancel button */
    displayCancelButton?: boolean;
  } & ComponentProps<typeof DialogFooter>
>;
