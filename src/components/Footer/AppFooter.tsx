import type { AppDialFooterProps } from "@/components/Footer/types/footer.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { CardFooter } from "@/components/ui/card.tsx";
import { DialogClose, DialogFooter } from "@/components/ui/dialog.tsx";
import type { ComponentProps } from "react";

/**
 * A Footer component for App Dialogs with a submit button and a cancel button.
 * @description This component wraps a DialogFooter so the AppDialog can use either DialogFooter or CardFooter.
 * @param props - Props for the DialogFooter component.
 * @param cancelText - Text for the cancel button. Defaults to "Annuler".
 * @param submitText - Text for the submit button. Defaults to "Créer".
 * @param formId - The id of the form to be submitted.
 * @param displaySubmitButton - Whether to display the submit button. Defaults to true.
 * @param formState - The form state object to determine if the form is valid.
 */
export function AppDialFooter({
  cancelText,
  submitText,
  formState,
  formId,
  displaySubmitButton = true,
  displayCancelButton = true,
  ...props
}: AppDialFooterProps) {
  const isValid = formState?.isValid ?? true;
  const isSubmitting = formState?.isSubmitting ?? false;
  const isSubmitSuccessful = formState?.isSubmitSuccessful ?? false;
  const cancelTextValue = cancelText || "Annuler";
  const submitTextValue = submitText || "Créer";

  const isDisabledCondition = isSubmitSuccessful || isSubmitting || !isValid;

  return (
    <DialogFooter {...props}>
      {displayCancelButton && (
        <DialogClose asChild className="justify-end">
          <Button variant="outline">{cancelTextValue}</Button>
        </DialogClose>
      )}
      {displaySubmitButton && (
        <Button
          variant="outline"
          className="justify-end mr-6"
          type="submit"
          disabled={isDisabledCondition}
          form={formId}
        >
          {submitTextValue}
        </Button>
      )}
      {props.children}
    </DialogFooter>
  );
}

/**
 * A Footer component for App Cards.
 * @description This component wraps a CardFooter so the AppCard can use either CardFooter or DialogFooter.
 * @param props - Props for the CardFooter component.
 */
export function AppCardFooter(
  props: Readonly<ComponentProps<typeof CardFooter>>,
) {
  return <CardFooter {...props}>{props.children}</CardFooter>;
}
