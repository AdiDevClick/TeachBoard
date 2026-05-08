import type { LargeButtonWithIconAndLinkProps } from "@/components/Buttons/types/ButtonTypes";
import type { AppModalNames } from "@/configs/app.config";
import type { OAuthProvider } from "@/features/auth/components/oauth/types/oauth.types";

/**
 * Login page social icons.
 */
export const loginButtonsSvgs = [
  {
    label: "Se connecter avec Microsoft",
    pageId: "Microsoft-login",
    routerPath: "microsoft-callback",
    iconPath: "microsoft",
    provider: "microsoft",
    url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    auth: true,
  },
  {
    label: "Se connecter avec Google",
    pageId: "Google-login",
    routerPath: "google-callback",
    provider: "google",
    iconPath: "google",
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    auth: true,
  },
] satisfies ReadonlyArray<
  LargeButtonWithIconAndLinkProps & {
    pageId: AppModalNames;
    routerPath: string;
    provider: OAuthProvider;
  }
>;
