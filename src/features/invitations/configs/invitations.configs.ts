/**
 * Configuration file for the Invitations feature, containing constants and default values used across the Invitations components and controllers.
 */

import type { QRCodeInvitationButtonConfig } from "@/features/invitations/configs/types/invitations-configs.types";

/**
 * Configuration for the buttons used in the Invitations feature, defining the label and type for each button that allows users to share or export their invitation QR code.
 */
export const qrCodeInvitationsButtonsConfig = [
  // {
  //   label: "Partager le lien d'invitation",
  // },
  {
    label: "Exporter en .JPG",
    action: "export-jpg",
  },
  {
    label: "Exporter en .PNG",
    action: "export-png",
  },
  {
    label: "Imprimer",
    action: "print",
  },
] satisfies ReadonlyArray<QRCodeInvitationButtonConfig>;

/**
 * The default link encoded in the QR code for invitations. This can be updated to point to the actual invitation URL or a dynamic link generator as needed.
 */
export const defaultQRCodeInvitationLink = `${import.meta.resolve("/login")}`;
