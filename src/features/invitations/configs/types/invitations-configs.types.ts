import type { LargeButtonWithIconAndLinkProps } from "@/components/Buttons/types/ButtonTypes";

/**
 * Determines the type of actions to follow
 */
export type QRCodeInvitationButtonAction =
  | "export-jpg"
  | "export-png"
  | "print";

export type QRCodeInvitationButtonConfig = LargeButtonWithIconAndLinkProps & {
  action: QRCodeInvitationButtonAction;
};
