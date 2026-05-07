import { withToolTip } from "@/components/HOCs/withToolTip";
import { defaultQRCodeInvitationLink } from "@/features/invitations/configs/invitations.configs";
import type { InvitationsControllerProps } from "@/features/invitations/controllers/types/invitations-controller.types";
import { QRCodeCanvas } from "qrcode.react";

const invitationLogoSvg = encodeURIComponent(
  `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="96"
    height="96"
    viewBox="0 0 96 96"
    fill="none"
  >
    <rect width="96" height="96" rx="24" fill="#ffffff" />
    <path d="M28 28h40v10H54v30H42V38H28V28Z" fill="#0f172a" />
  </svg>`,
);

const invitationLogoSrc = `data:image/svg+xml;charset=UTF-8,${invitationLogoSvg}`;

/**
 * Controller component for the Invitations feature, responsible for rendering the QR code with the appropriate configurations and handling any related logic.
 *
 * @description This component uses the `QRCodeCanvas` from the `qrcode.react` library to generate a QR code based on the provided value. It also incorporates a tooltip for user guidance and includes an embedded logo in the center of the QR code.
 *
 * @param value - The value to encode in the QR code, typically a URL for the invitation. Defaults to a predefined link if not provided.
 * @param tooltip - The text to display in the tooltip when hovering over the QR code, providing instructions or information about the QR code's purpose.
 */
export function InvitationsController({
  value = defaultQRCodeInvitationLink,
  tooltip = "Scannez ce QR code pour rejoindre l'invitation",
  ...props
}: InvitationsControllerProps) {
  return (
    <QRCodeInvitation
      {...props}
      className="max-w-full object-contain"
      toolTipText={tooltip}
      value={value}
      title={tooltip}
      size={512}
      marginSize={4}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      //@ts-expect-error - The `imageSettings` prop is not recognized by the QRCodeCanvas component's type definitions, but it is a valid prop for customizing the embedded image in the QR code.
      // Not using specific width and height allows the image to scale proportionally within the QR code.
      imageSettings={{
        src: invitationLogoSrc,
        opacity: 1,
        excavate: true,
      }}
    />
  );
}

const QRCodeInvitation = withToolTip(QRCodeCanvas);
