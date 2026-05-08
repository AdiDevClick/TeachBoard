import { useAppStore } from "@/api/store/AppStore";
import { Spinner } from "@/components/ui/spinner";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { debugLogs } from "@/configs/app-components.config";
import { HTTP_METHODS } from "@/configs/app.config";
import { AUTH_STATE_KEY } from "@/features/auth/components/oauth/configs/oauth.configs";
import type { OAuthProps } from "@/features/auth/components/oauth/types/oauth.types";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function OAuth({
  pageId = "Google-login",
  provider = "google",
  submitRoute = API_ENDPOINTS.POST.AUTH.LOGIN.endpoints.OAUTH,
  submitDataReshapeFn = API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape,
}: OAuthProps) {
  const [params] = useSearchParams();
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  const { submitCallback } = useCommandHandler({
    form: null!,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  const seenRef = useRef(false);

  const stateStorageKey = `${AUTH_STATE_KEY}-${provider}`;
  const storedState = useMemo(
    () => localStorage.getItem(stateStorageKey),
    [stateStorageKey],
  );
  const returnedState = params.get("state");

  const code = params.get("code");
  const error = params.get("error");

  const isFailedAuth =
    (!code && !returnedState) || storedState !== returnedState;
  const processAuthResult = useEffectEvent((isFailedAuth: boolean) => {
    if (isFailedAuth) {
      toast.error(`L'authentification ${pageId} a échoué. Veuillez réessayer.`);
      debugLogs(`${pageId} OAuth error:`, { type: "auth", error });
      seenRef.current = true;
      navigate("/login", { replace: true });
    } else {
      seenRef.current = true;
      submitCallback(
        { code, provider },
        {
          method: HTTP_METHODS.POST,
          reshapeOptions: { login },
          onSuccess: () => {
            localStorage.removeItem(stateStorageKey);
            navigate("/", { replace: true });
          },
          successDescription(success) {
            return { type: "success", descriptionMessage: success.message };
          },
          onError(error) {
            localStorage.removeItem(stateStorageKey);
            debugLogs(`${pageId} OAuth submission error:`, {
              type: "auth",
              error,
            });
            navigate("/login", { replace: true });
          },
          errorMessage() {
            return `Nous sommes désolés, une erreur est survenue lors de l'authentification ${pageId}.`;
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
      <p>Processing authentication...</p>
    </Spinner>
  );
}
