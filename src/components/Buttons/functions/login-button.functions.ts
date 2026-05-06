/**
 * Builds the authentication URL for social login.
 *
 * @param baseURL - The base URL of the authentication endpoint (e.g., Google's OAuth endpoint)
 * @returns The complete authentication URL
 */
export function buildAuthURL(baseURL: string) {
  const state = crypto.randomUUID();
  localStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID",
    redirect_uri:
      import.meta.env.VITE_GOOGLE_REDIRECT_URI || "YOUR_REDIRECT_URI",
    access_type: "online",
    response_type: "code",
    scope: "email profile",
    include_granted_scopes: "true",
    state,
  });

  const url = new URL(baseURL);
  url.search = params.toString();

  return url.toString();
}
