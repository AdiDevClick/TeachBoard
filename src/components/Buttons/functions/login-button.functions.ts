import { AUTH_STATE_KEY } from "@/features/auth/components/oauth/configs/oauth.configs";
import type { OAuthProvider } from "@/features/auth/components/oauth/types/oauth.types";

/**
 * Builds the authentication URL for social login.
 *
 * @param baseURL - The base URL of the authentication endpoint (e.g., Google's OAuth endpoint)
 * @returns The complete authentication URL
 */
export function buildAuthURL(baseURL: string): string {
  const state = crypto.randomUUID();

  let paramsObject: Record<string, string> = {};
  let provider: OAuthProvider;

  const {
    VITE_GOOGLE_CLIENT_ID,
    VITE_MICROSOFT_CLIENT_ID,
    VITE_GOOGLE_REDIRECT_URI,
    VITE_MICROSOFT_REDIRECT_URI,
  } = import.meta.env;

  switch (true) {
    case baseURL.includes("google"):
      paramsObject = {
        client_id: VITE_GOOGLE_CLIENT_ID,
        redirect_uri: encodeURI(VITE_GOOGLE_REDIRECT_URI),
        access_type: "online",
        response_type: "code",
        scope: "email profile",
        include_granted_scopes: "true",
        state,
      };
      provider = "google";
      break;
    case baseURL.includes("microsoft"):
      paramsObject = {
        client_id: VITE_MICROSOFT_CLIENT_ID,
        redirect_uri: encodeURI(VITE_MICROSOFT_REDIRECT_URI),
        response_mode: "query",
        response_type: "code",
        prompt: "select_account",
        scope:
          "openid profile email offline_access https://graph.microsoft.com/.default",
        state,
      };
      provider = "microsoft";
      break;
    default:
      return "#";
  }

  localStorage.setItem(`${AUTH_STATE_KEY}-${provider}`, state);

  const params = new URLSearchParams(paramsObject);

  const url = new URL(baseURL);
  url.search = params.toString();

  return url.toString();
}
