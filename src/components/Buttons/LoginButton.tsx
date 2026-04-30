import type { LoginButtonProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { Icon } from "@/components/Icons/Icon.tsx";
import { Button } from "@/components/ui/button";
import {
  debugLogs,
  loginButtonContainsInvalid,
} from "@/configs/app-components.config.ts";
import { Link } from "react-router-dom";

/**
 * Login button component
 * @description Renders a login button with an icon and name.
 *
 * Can be used with ListMapper which will automatically provide the icon prop.
 * When used standalone, the icon prop must be provided manually.
 *
 * @link configs/social.config.ts for the item structure
 *
 * @param name - The display name of the login button
 * @param path - The path to the icon SVG
 * @param url - The URL to navigate to on button click
 * @param buttonProps - Additional button HTML attributes
 */
export function LoginButton(props: Readonly<LoginButtonProps>) {
  if (loginButtonContainsInvalid(props)) {
    debugLogs("LoginButton", { type: "propsValidation", props });
    return null;
  }

  const { name, path, url, ...buttonProps } = props;

  const authURL = buildAuthURL(url ?? "#");

  return (
    <Button asChild variant="outline" type="button" {...buttonProps}>
      <Link to={authURL} target="_blank" rel="noopener noreferrer">
        {path && <Icon iconPath={path} />}
        {name}
      </Link>
    </Button>
  );
}

function buildAuthURL(baseURL: string) {
  const state = crypto.randomUUID();
  localStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID",
    redirect_uri:
      import.meta.env.VITE_GOOGLE_REDIRECT_URI || "YOUR_REDIRECT_URI",
    access_type: "online",
    response_type: "token",
    scope: "email profile",
    include_granted_scopes: "true",
    state,
  });

  const url = new URL(baseURL);
  url.search = params.toString();

  return url.toString();
}
