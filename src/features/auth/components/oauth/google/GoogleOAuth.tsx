import { Spinner } from "@/components/ui/spinner";
import { debugLogs } from "@/configs/app-components.config";
import { HTTP_METHODS, type AppModalNames } from "@/configs/app.config";
import { AUTH_STATE_KEY } from "@/features/auth/components/oauth/configs/oauth.configs";
import type { GoogleOAuthProps } from "@/features/auth/components/oauth/google/types/google-oauth.types";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function GoogleOAuth({
  pageId = "google-auth" as AppModalNames,
  submitRoute = "/auth/google",
  submitDataReshapeFn = undefined,
}: GoogleOAuthProps) {
  const [params, _setParams] = useSearchParams();
  const navigate = useNavigate();
  const { submitCallback } = useCommandHandler({
    form: null!,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  const seenRef = useRef(false);

  const storedState = useMemo(() => localStorage.getItem(AUTH_STATE_KEY), []);
  const returnedState = params.get("state");

  const code = params.get("code");
  const error = params.get("error");

  const isFailedAuth =
    (!code && !returnedState) || storedState !== returnedState;

  const processAuthResult = useEffectEvent((isFailedAuth: boolean) => {
    if (isFailedAuth) {
      debugLogs("Google OAuth error:", { type: "auth", error });
      seenRef.current = true;
      toast.error("L'authentification Google a échoué. Veuillez réessayer.");
      navigate("/login", { replace: true });
    } else {
      seenRef.current = true;
      submitCallback(
        { code },
        {
          method: HTTP_METHODS.POST,
          onSuccess: () => {
            localStorage.removeItem(AUTH_STATE_KEY);
            navigate("/", { replace: true });
          },
          successDescription(success) {
            return { type: "success", descriptionMessage: success.message };
          },
          onError(error) {
            localStorage.removeItem(AUTH_STATE_KEY);
            debugLogs("Google OAuth submission error:", {
              type: "auth",
              error,
            });
            navigate("/login", { replace: true });
          },
          errorMessage() {
            return "Nous sommes désolés, une erreur est survenue lors de l'authentification Google.";
          },
        },
      );
    }
  });

  useEffect(() => {
    if (seenRef.current) return;
    processAuthResult(isFailedAuth);
  }, [isFailedAuth]);

  return (
    <Spinner className="size-8 inset-0 m-auto">
      <p>Processing Google OAuth...</p>
    </Spinner>
  );
}
