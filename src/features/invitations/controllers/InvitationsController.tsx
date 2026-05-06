import { QRCodeSVG } from "qrcode.react";

export function InvitationsController() {
  return (
    <QRCodeSVG
      value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
      title={"Title for my QR Code"}
      size={128}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      imageSettings={{
        src: "https://static.zpao.com/favicon.png",
        x: undefined,
        y: undefined,
        height: 24,
        width: 24,
        opacity: 1,
        excavate: true,
      }}
    />
  );
}
