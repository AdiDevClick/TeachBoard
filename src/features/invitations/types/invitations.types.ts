import type { AppDialogNames } from "@/configs/app.config";
import type { InvitationsPage } from "@/features/invitations/exports/invitations.exports";
import type { ComponentProps } from "react";

/**
 * Type definitions for the Invitations component
 */
export type InvitationsProps = {
  /**
   * Optional name for the exported QR code image
   *
   * @default "TeachBoard_QR_Code_Invitation"
   */
  fileName?: string;
  /**
   * Optional ID for the page/dialog, used for managing the state of the drawer in which the Invitations component is rendered.
   *
   * @default "invitations"
   */
  pageId?: AppDialogNames;
} & ComponentProps<typeof InvitationsPage>["drawerContent"];
