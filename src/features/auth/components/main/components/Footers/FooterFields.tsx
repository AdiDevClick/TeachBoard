import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { FooterFieldsProps } from "@/features/auth/components/main/components/Footers/types/footer-fields.types";
import { useFormState } from "react-hook-form";

/**
 * Footer fields component for the login form, including the submit button and a link to toggle between login and password recovery modes.
 *
 * @param form - The form object returned by the useForm hook, containing methods and state for managing the form.
 * @param formId - The ID of the form, used to associate the submit button with the form.
 * @param textToDisplay - An object containing text for the button and link, allowing for dynamic display based on the current mode (login or password recovery).
 * @param onClick - Optional click handler for the link, allowing for custom behavior when toggling between modes.
 */
export function FooterFields<TFormValues extends Record<string, unknown>>({
  form,
  formId,
  textToDisplay,
  onClick,
}: FooterFieldsProps<TFormValues>) {
  const { isValid } = useFormState<TFormValues>({ control: form.control });
  return (
    <Field>
      <Button type="submit" disabled={!isValid} form={formId}>
        {textToDisplay.buttonText}
      </Button>
      <AppFieldDescriptionWithLink
        linkText="Inscrivez-vous ici"
        linkTo="/signup"
        onClick={onClick}
      >
        {"Vous n'avez pas de compte ? "}
      </AppFieldDescriptionWithLink>
    </Field>
  );
}
