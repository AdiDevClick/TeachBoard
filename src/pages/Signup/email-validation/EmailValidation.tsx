import { HeaderTitle } from "@/components/Titles/ModalTitle.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSignupValidation } from "@/hooks/database/signup/email-validation/useSignupValidation.ts";
import { cn } from "@/utils/utils.ts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
type EmailValidationProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function EmailValidation({
  className = "",
  ...props
}: EmailValidationProps) {
  const { closeAllDialogs } = useDialog();
  const urlParams = useParams();
  const { data, error, isLoading, queryFn } = useSignupValidation({
    urlParams,
  });

  useEffect(() => {
    if (!urlParams || isLoading || data) return;
    const startValidation = async () => {
      closeAllDialogs();
      await queryFn();
    };
    startValidation();
  }, [data]);

  useEffect(() => {
    if (data) {
      if (import.meta.env.DEV) {
        console.debug("EmailValidation onSuccess:", data);
      }
    }

    if (error) {
      if (import.meta.env.DEV) {
        console.debug("EmailValidation onError:", error);
      }
    }
  }, [data, error, isLoading]);

  const description =
    (data?.success || error?.message) ?? "Vérification en cours...";

  return (
    <Card className={cn("flex flex-col gap-6", className)} {...props}>
      <HeaderTitle
        title="Validation de votre inscription"
        description={description}
      />
      <CardContent>
        {/* <form
          id="signup-form"
          onSubmit={form.handleSubmit(queryFn)}
          className="grid gap-4"
        >
          <FieldGroup>
            <Inputs items={inputControllers} form={form} />
            <Field>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                form="signup-form"
              >
                S'enregistrer
              </Button>
            </Field>
          </FieldGroup>
        </form> */}
      </CardContent>
    </Card>
  );
}
