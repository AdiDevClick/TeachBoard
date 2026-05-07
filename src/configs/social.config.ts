/**
 * Login page social icons.
 */
export const loginButtonsSvgs = [
  {
    label: "Se connecter avec Apple",
    iconPath: "apple",
    url: "https://github.com/AdiDevClick",
  },
  {
    label: "Se connecter avec Microsoft",
    iconPath: "microsoft",
    url: "https://linkedin.com/in/adrienquijo",
  },
  {
    label: "Se connecter avec Google",
    iconPath: "google",
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    auth: true,
  },
];
export type LoginButtonsSvgsType = (typeof loginButtonsSvgs)[number];
