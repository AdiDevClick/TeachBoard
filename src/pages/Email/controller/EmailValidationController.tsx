import { Button } from "@/components/ui/button.tsx";
import {
  APP_REDIRECT_TIMEOUT,
  DEV_MODE,
  NO_QUERY_LOGS,
} from "@/configs/app.config.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSessionChecker } from "@/hooks/database/sessions/useSessionChecker.ts";
import { useAuthMemoryStore } from "@/hooks/store/AuthMemoryStore.ts";
import type { EmailControllerProps } from "@/pages/Signup/types/signup.types.ts";
import { wait } from "@/utils/utils.ts";
import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 *
 * Email Validation Controller
 *
 * @description This component handles the email validation process during user signup OR password recovery.
 *
 * @param props - Props containing data, error, and onSubmit function from the validation hook
 */
export function EmailValidationController(
  props: Readonly<EmailControllerProps>
) {
  const { data, error, onSubmit } = props;
  const navigate = useNavigate();
  const { closeAllDialogs } = useDialog();

  const {
    data: sessionData,
    error: sessionError,
    onSubmit: onSessionCheck,
  } = useSessionChecker();

  const setSignupToken = useAuthMemoryStore((state) => state.setSignupToken);

  const hasStartedValidation = useRef(false);

  const startValidation = useCallback(() => {
    if (!hasStartedValidation.current) hasStartedValidation.current = true;
    closeAllDialogs();
    onSubmit();
  }, []);

  /**
   * Main init
   */
  useEffect(() => {
    if (hasStartedValidation.current) return;
    hasStartedValidation.current = true;
    startValidation();
  }, []);

  /**
   * Results
   */
  useEffect(() => {
    const triggerNavigation = async (page: string) => {
      await wait(APP_REDIRECT_TIMEOUT);
      navigate(page, { replace: true });
    };

    if (error || sessionError) {
      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug(
          "EmailValidation redirecting to /login due to error:",
          error ?? sessionError
        );
      }
      triggerNavigation("/login");
      return;
    }

    if (!data) return;

    const token = (data as unknown as { token?: string })?.token ?? "";

    if (!sessionData && !sessionError) {
      onSessionCheck();
      return;
    }

    if (sessionData) {
      setSignupToken(token);
      triggerNavigation("/password-creation");
      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("EmailValidation onSuccess:", data);
      }
    }
  }, [data, error, sessionData, sessionError]);

  return (
    <>
      {error?.message && (
        <Link to="/">
          <Button type="button">Revenir à l'accueil</Button>
        </Link>
      )}
    </>
  );
}
