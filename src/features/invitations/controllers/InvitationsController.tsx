import { withToolTip } from "@/components/HOCs/withToolTip";
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

type InvitationsControllerProps = Readonly<
  {
    value?: string;
    tooltip?: string;
  } & (ComponentProps<typeof QRCodeCanvas> | ComponentProps<typeof QRCodeSVG>)
>;

export function InvitationsController({
  value = "https://localhost:5173/login",
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
      imageSettings={{
        src: invitationLogoSrc,
        // width: 24,
        // height: 24,
        opacity: 1,
        excavate: true,
      }}
    />
  );
}

const QRCodeInvitation = withToolTip(QRCodeCanvas);
