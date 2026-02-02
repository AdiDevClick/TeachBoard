import type { DialogFooter } from "@/components/ui/dialog.tsx";
import type { ComponentProps } from "react";

export type AppDialFooterProps = Readonly<
  {
    /** Text for the cancel button */
    cancelText?: string;
    /** An object containing text for the submit button */
    submitText?: string;
    /** The form state object to determine if the form is valid */
    formState: {
      isValid: boolean;
    };
    /** The id of the form to be submitted */
    formId: string;
    /** Whether to display the submit button */
    displaySubmitButton?: boolean;
  } & ComponentProps<typeof DialogFooter>
>;
