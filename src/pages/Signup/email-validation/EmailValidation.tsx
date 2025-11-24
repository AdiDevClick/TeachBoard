import { HeaderTitle } from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DEV_MODE } from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSessionChecker } from "@/hooks/database/sessions/useSessionChecker.ts";
import { useSignupValidation } from "@/hooks/database/signup/email-validation/useSignupValidation.ts";
import { useAuthMemoryStore } from "@/hooks/store/AuthMemoryStore";
import type { EmailValidationProps } from "@/pages/Signup/types/signup.types.ts";
import {
  GENERIC_CONTAINER_STYLE,
  GENERIC_CONTENT_STYLE,
} from "@/utils/styles/generic-styles.ts";
import { cn, wait } from "@/utils/utils.ts";
import { useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
  const {
    data: sessionData,
    error: sessionError,
    onSubmit: onSessionCheck,
  } = useSessionChecker();

  const setSignupToken = useAuthMemoryStore((state) => state.setSignupToken);

  const startValidation = useCallback(async () => {
    closeAllDialogs();
    await onSubmit();
  }, []);

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
      const token = (data as unknown as { token?: string })?.token ?? "";
      if (!sessionData) {
        onSessionCheck();
      }

      if (sessionData) {
        // Session valid, we can pursue password creation
        // & Store token in memory (not persisted)
        setSignupToken(token);
        triggerNavigation("/password-creation");
        return;
      }

      if (DEV_MODE) {
        console.debug("EmailValidation onSuccess:", data);
      }
    }

    if (error || sessionError) {
      triggerNavigation("/login");
      if (DEV_MODE) {
        console.debug("EmailValidation onError:", error);
      }
    }
  }, [data, error, isLoading, sessionData]);

  const description =
    (data?.success || error?.message) ?? "Vérification en cours...";

  let title = "Validation de votre inscription";
  if (data?.success) title = "Succès !";
  else if (error?.message) title = "Échec de la validation...";

  return (
    <div className={GENERIC_CONTAINER_STYLE.className}>
      <div className={GENERIC_CONTENT_STYLE.className}>
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
