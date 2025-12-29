import type { DialogFooter } from "@/components/ui/dialog.tsx";
import type { ComponentProps } from "react";

export type AppDialFooterProps = {
  /** Text for the cancel button */
  cancelText?: string;
  /** An object containing text for the submit button */
  submitText?: string;
  /** The form state object to determine if the form is valid */
  formState: {
    isValid: boolean;
  };
  /** The id of the form to be submitted */
  formId?: string;
} & ComponentProps<typeof DialogFooter>;
