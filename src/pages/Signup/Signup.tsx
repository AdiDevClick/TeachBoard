import { ControlledInputList } from "@/components/Inputs/exports/labelled-input";
import {
  DialogHeaderTitle,
  HeaderTitle,
} from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { inputSignupControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSignup } from "@/hooks/database/signup/useSignup.ts";
import { signupSchema } from "@/models/signup.models.ts";
import type {
  SignupFormSchema,
  SignupInputItem,
} from "@/pages/Signup/types/signup.types.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 * Signup form component
 *
 * @param modalMode - Flag to indicate if the form is in modal mode (default: false)
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects.
 * This needs to be stricly typed to match the SignupFormSchema
 * @param props - Optional props for the component of div type for the Card
 */
export function Signup({
  pageId = "signup",
  modalMode = false,
  className,
  inputControllers = inputSignupControllers,
  ...props
}: Readonly<PageWithControllers<SignupInputItem>>) {
  const { data, isLoaded, isLoading, onSubmit, error } = useSignup();
  const { closeAllDialogs } = useDialog();

  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      username: "",
    },
  });

  useEffect(() => {
    if (data && isLoaded) {
      form.reset();
      closeAllDialogs();
    }
    if (import.meta.env.DEV) {
      console.debug("Signup Component:", { data, isLoaded, isLoading, error });
    }
  }, [data, isLoaded]);

  /**
   * Determine the title component based on modal mode
   * @description Uses HeaderTitle directly in modal mode, otherwise wraps it with the dialog header HOC
   */
  const Title = modalMode ? DialogHeaderTitle : HeaderTitle;
  const formId = `${pageId}-form`;

  return (
    <Card id={pageId} className={className} {...props}>
      <Title
        title="S'enregistrer"
        description="Rejoignez-nous pour faciliter votre quotidien !"
      />
      <CardContent>
        <form
          id={formId}
          onSubmit={isLoading ? undefined : form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <FieldGroup>
            <ControlledInputList items={inputControllers} form={form} />
            <Field>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                form={formId}
              >
                S'enregistrer
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
