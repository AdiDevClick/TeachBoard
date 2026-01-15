import { useAuthMemoryStore } from "@/api/store/AuthMemoryStore";
import { ControlledInputList } from "@/components/Inputs/LaballedInputForController.tsx";
import { HeaderTitle } from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { DEV_MODE } from "@/configs/app.config.ts";
import { passwordCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { usePasswordCreation } from "@/hooks/database/pw-creation/usePasswordCreation.ts";
import { pwCreationSchema } from "@/models/password-creation.models.ts";
import type {
  PasswordCreationFormSchema,
  PasswordCreationInputItem,
} from "@/pages/Password/types/password-page.types.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import {
  GENERIC_CONTAINER_STYLE,
  GENERIC_CONTENT_STYLE,
} from "@/utils/styles/generic-styles.ts";
import { cn, wait } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

let title = "Créer un mot de passe";
let description =
  "Choisissez un mot de passe sécurisé pour protéger votre compte.";

/**
 * Password Creation Form Schema
 *
 * @param props - All props forwarded to the Card component
 * @param modalMode - Flag to indicate if the form is in modal mode (default: false)
 * @param inputControllers - Array of input controller objects
 * @returns
 */
export function PasswordCreation({
  pageId = "password-creation-page-card",
  modalMode = false,
  className,
  inputControllers = passwordCreationInputControllers,
  ...props
}: Readonly<PageWithControllers<PasswordCreationInputItem>>) {
  const { closeAllDialogs } = useDialog();
  const navigate = useNavigate();
  const signupToken = useAuthMemoryStore((state) => state.signupToken);
  const { data, error, isLoading, onSubmit } = usePasswordCreation({
    token: signupToken,
  });

  const form = useForm<PasswordCreationFormSchema>({
    resolver: zodResolver(pwCreationSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  /**
   * Initial check for signup token
   */
  useEffect(() => {
    if (!signupToken) {
      toast.dismiss();
      toast.error("Session invalide. Veuillez valider votre email.");
      navigate("/login");
    }
  }, []);

  /**
   * Main -
   * It can only happen if a valid signup token is present
   */
  useEffect(() => {
    const toastLoaderId = "password-creation-loading";

    const triggerNavigation = async () => {
      form.reset();
      closeAllDialogs();
      await wait(1500);
      navigate("/login");
    };

    if (isLoading) {
      toast.loading("Création du mot de passe en cours...", {
        id: toastLoaderId,
      });
    }

    if (data || error) {
      toast.dismiss(toastLoaderId);

      if (!isLoading) triggerNavigation();
    }

    if (DEV_MODE) {
      console.debug("PasswordCreation Component:", { data, isLoading, error });
    }
  }, [data, isLoading, error]);

  if (isLoading) {
    title = "Création du mot de passe";
    description =
      "Veuillez patienter pendant que nous créons votre mot de passe sécurisé.";
  }
  const formId = `${pageId}-form`;

  return (
    <div {...GENERIC_CONTAINER_STYLE}>
      <div {...GENERIC_CONTENT_STYLE}>
        <Card
          id={pageId}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <HeaderTitle title={title} description={description} />
          <CardContent>
            {!data && (
              <form
                id={formId}
                onSubmit={isLoading ? undefined : form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FieldGroup>
                  <ControlledInputList items={inputControllers} form={form} />
                  <Field>
                    <Button
                      form={formId}
                      type="submit"
                      disabled={!form.formState.isValid}
                    >
                      Créer
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
            {data && (
              <div className="text-center text-green-600">
                <p>
                  Votre mot de passe a été créé avec succès ! Vous pouvez
                  maintenant vous connecter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
