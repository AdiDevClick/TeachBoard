import { withToolTip } from "@/components/HOCs/withToolTip";
import { defaultQRCodeInvitationLink } from "@/features/invitations/configs/invitations.configs";
import type { InvitationsControllerProps } from "@/features/invitations/controllers/types/invitations-controller.types";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import type { ComponentProps } from "react";

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
