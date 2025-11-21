import { Inputs } from "@/components/Inputs/Inputs.tsx";
import { HeaderTitle } from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { DEV_MODE } from "@/configs/app.config.ts";
import { passwordCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { usePasswordCreation } from "@/hooks/database/pw-creation/usePasswordCreation.ts";
import { pwCreationSchema } from "@/models/password-creation.models.ts";
import { genericStyle } from "@/utils/styles/generic-styles.ts";
import { cn } from "@/utils/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/**
 * Use it once or insert it into the component
 * if you need to add dynamic styles based on props or state
 * in the future.
 */
const { containerStyle, contentStyle } = genericStyle();

/**
 * Password Creation Form Schema
 *
 * @param props - All props forwarded to the Card component
 * @param modaleMode - Flag to indicate if the form is in modal mode (default: false)
 * @param inputControllers - Array of input controller objects
 * @returns
 */
export function PasswordCreation({
  modaleMode = false,
  className,
  inputControllers,
  ...props
}: PasswordCreationProps) {
  const { closeAllDialogs } = useDialog();
  const { data, error, isLoading, onSubmit } = usePasswordCreation();

  const form = useForm<PasswordCreationFormSchema>({
    resolver: zodResolver(pwCreationSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  /** Main */
  useEffect(() => {
    const toastLoaderId = "password-creation-loading";

    if (isLoading) {
      toast.loading("Création du mot de passe en cours...", {
        id: toastLoaderId,
      });
    }

    if (data || error) {
      toast.dismiss(toastLoaderId);
    }

    if (data && !isLoading) {
      form.reset();
      closeAllDialogs();
    }

    if (DEV_MODE) {
      console.debug("PasswordCreation Component:", { data, isLoading, error });
    }
  }, [data, isLoading, error]);

  return (
    <div {...containerStyle}>
      <div {...contentStyle}>
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
          <HeaderTitle
            title="Créer un mot de passe"
            description="Choisissez un mot de passe sécurisé pour protéger votre compte."
          />
          <CardContent>
            <form
              id="password-creation-form"
              onSubmit={isLoading ? undefined : form.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FieldGroup>
                <Inputs items={passwordCreationInputControllers} form={form} />
                <Field>
                  <Button type="submit" disabled={isLoading}>
                    Créer
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
