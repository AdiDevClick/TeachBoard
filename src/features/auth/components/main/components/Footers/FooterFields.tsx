import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { FooterFieldsProps } from "@/features/auth/components/main/components/Footers/types/footer-fields.types";
import { useAppForm } from "@/features/auth/hooks/useAppForm";
import { useFormState } from "react-hook-form";

/**
 * Footer fields component for the login form, including the submit button and a link to toggle between login and password recovery modes.
 *
 * @param form - The form object returned by the useForm hook, containing methods and state for managing the form.
 * @param formId - The ID of the form, used to associate the submit button with the form.
 * @param textToDisplay - An object containing text for the button and link, allowing for dynamic display based on the current mode (login or password recovery).
 * @param pageId - The identifier of the page/context where the form is used; forwarded to useAppForm for analytics/command handling.
 * @param onClick - Optional click handler for the link, allowing for custom behavior when toggling between modes.
 */
export function FooterFields({
  form,
  formId,
  textToDisplay,
  pageId,
}: Readonly<FooterFieldsProps>) {
  const { isValid } = useFormState({ control: form.control });
  const { newItemCallback } = useAppForm({ form, pageId });
  return (
    <Field>
      <Button type="submit" disabled={!isValid} form={formId}>
        {textToDisplay.buttonText}
      </Button>
      <AppFieldDescriptionWithLink
        linkText="Inscrivez-vous ici"
        linkTo="/signup"
        onClick={(e) =>
          newItemCallback({
            e,
            task: "signup",
          })
        }
      >
        {"Vous n'avez pas de compte ? "}
      </AppFieldDescriptionWithLink>
    </Field>
  );
}
