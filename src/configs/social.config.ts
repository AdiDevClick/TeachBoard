import type { LargeButtonWithIconAndLinkProps } from "@/components/Buttons/types/ButtonTypes";

/**
 * Login page social icons.
 */
export const loginButtonsSvgs = [
  {
    label: "Se connecter avec Google",
    iconPath: "google",
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    auth: true,
  },
] satisfies ReadonlyArray<LargeButtonWithIconAndLinkProps>;
