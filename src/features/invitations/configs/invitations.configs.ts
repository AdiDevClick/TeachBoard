/**
 * Configuration file for the Invitations feature. This file contains constants and configurations related to the invitations functionality, such as button configurations and default links.
 */

import type { LargeButtonWithIconAndLinkProps } from "@/components/Buttons/types/ButtonTypes";

/**
 * Configuration for the buttons used in the QR code invitations page.
 * Each button has a label that indicates its function, such as sharing the invitation link, exporting the QR code as an image, or printing it.
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
export const defaultQRCodeInvitationLink = "https://localhost:5173/login";
