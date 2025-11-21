import { HeaderTitle } from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DEV_MODE } from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSignupValidation } from "@/hooks/database/signup/email-validation/useSignupValidation.ts";
import type { EmailValidationProps } from "@/pages/Signup/types/signup.types.ts";
import { genericStyle } from "@/utils/styles/generic-styles.ts";
import { cn, wait } from "@/utils/utils.ts";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/**
 * Use it once or insert it into the component
 * if you need to add dynamic styles based on props or state
 * in the future.
 */
const { containerStyle, contentStyle } = genericStyle();

/**
 *
 * Email Validation Component
 *
 * @description This component handles the email validation process during user signup.
 * It interacts with the backend to validate the user's email based on URL parameters.
 *
 * @param className Optional additional class names for styling
 * @param props Additional HTML attributes for the container div
 */
export function EmailValidation({
  className = "",
  ...props
}: EmailValidationProps) {
  const navigate = useNavigate();
  const { closeAllDialogs } = useDialog();
  const urlParams = useParams();
  const { data, error, isLoading, onSubmit } = useSignupValidation({
    urlParams,
  });

  const startValidation = async () => {
    closeAllDialogs();
    await onSubmit();
  };

  /**
   * Main
   */
  useEffect(() => {
    if (!urlParams || isLoading || data) return;
    startValidation();
  }, [data]);

  /**
   * Results
   */
  useEffect(() => {
    const triggerNavigation = async (page: string) => {
      await wait(1500);
      navigate(page, { replace: true });
    };

    if (data) {
      const token = data.token ?? "";
      sessionStorage.setItem("signup_token", token);
      triggerNavigation("/password-creation");
      if (DEV_MODE) {
        console.debug("EmailValidation onSuccess:", data);
      }
    }

    if (error) {
      if (DEV_MODE) {
        console.debug("EmailValidation onError:", error);
      }
    }
  }, [data, error, isLoading]);

  const description =
    (data?.success || error?.message) ?? "Vérification en cours...";

  const title = data?.success
    ? "Succès !"
    : error?.message
    ? "Échec de la validation..."
    : "Validation de votre inscription";

  return (
    <div className={containerStyle.className}>
      <div className={contentStyle.className}>
        <Card className={cn("flex flex-col gap-6", className)} {...props}>
          <HeaderTitle
            id="email-validation-header"
            title={title}
            description={description}
          />
          {error?.message && (
            <CardContent style={{ marginInline: "auto" }}>
              <Link to="/">
                <Button type="button">Revenir à l'accueil</Button>
              </Link>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
