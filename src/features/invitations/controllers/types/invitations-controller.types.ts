import { defaultQRCodeInvitationLink } from "@/features/invitations/configs/invitations.configs";
import type { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import type { ComponentProps } from "react";

/**
 * This file defines the type for the props of the InvitationsController component, which is responsible for rendering a QR code for invitations.
 */
export type InvitationsControllerProps = Readonly<
  {
    /**
     * The value to be encoded in the QR code, typically a URL for the invitation.
     * {@link defaultQRCodeInvitationLink} is used as the default value if none is provided.
     */
    value?: string;
    /** The text to display in the tooltip when the user hovers over the QR code. */
    tooltip?: string;
  } & (ComponentProps<typeof QRCodeCanvas> | ComponentProps<typeof QRCodeSVG>)
>;
