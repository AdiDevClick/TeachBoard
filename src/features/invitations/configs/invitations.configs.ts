import type { LargeButtonWithIconAndLinkProps } from "@/components/Buttons/types/ButtonTypes";

/**
 * Configuration file for the Invitations feature, containing constants and default values used across the Invitations components and controllers.
 */

/**
 * Configuration for the buttons used in the Invitations feature, defining the label and type for each button that allows users to share or export their invitation QR code.
 */
export const qrCodeInvitationsButtonsConfig = [
  {
    label: "Partager le lien d'invitation",
  },
  {
    label: "Exporter en .JPG",
  },
  {
    label: "Exporter en .PNG",
  },
  {
    label: "Imprimer",
  },
] satisfies ReadonlyArray<LargeButtonWithIconAndLinkProps>;

/**
 * The default link encoded in the QR code for invitations. This can be updated to point to the actual invitation URL or a dynamic link generator as needed.
 */
export const defaultQRCodeInvitationLink = `${globalThis.location.origin ?? "https://localhost:5173"}/login`;
