import { debugLogs } from "@/configs/app-components.config";
import type { QRCodeInvitationButtonAction } from "@/features/invitations/configs/types/invitations-configs.types";
import type { FileDownloaderState } from "@/hooks/types/use-file-downloader.types";

/**
 * Handles the logic for exporting the QR code as an image file based on the user's selection.
 *
 * @param action - The stable action key declared in the invitations button config.
 * @param setFileState - Function to update the state for the file downloader, which triggers the download process.
 * @param canvasRef - A reference to the canvas element containing the QR code, used to generate the image data for export.
 * @param fileName - The base name for the exported file, which will be appended with the appropriate extension based on the selected format.
 */
export function switchActionsCases(
  action: QRCodeInvitationButtonAction,
  stateSetter: (state: FileDownloaderState) => void,
  canvas: HTMLCanvasElement | null,
  fileName: string,
) {
  let type = "";
  let fileNameWithExtension = "";

  if (!canvas) {
    debugLogs("Canvas reference is not available. Cannot export QR code.", {
      type: "propsValidation",
    });
    return;
  }

  switch (action) {
    case "export-jpg":
      type = "image/jpeg";
      fileNameWithExtension = `${fileName}.jpg`;
      break;
    case "export-png":
      type = "image/png";
      fileNameWithExtension = `${fileName}.png`;
      break;
    case "print":
      type = "print";
      break;
    default:
      break;
  }

  if (!type) {
    debugLogs("Unsupported action", {
      type: "forbiddenProp",
      message: `The button action "${action}" does not correspond to a valid export action.`,
    });
    return;
  }

  stateSetter({
    data: canvas,
    type,
    fileName: fileNameWithExtension,
  });
}
