import { LargeButtonList } from "@/components/Buttons/exports/buttons.exports";
import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { debugLogs } from "@/configs/app-components.config";
import { qrCodeInvitationsButtonsConfig } from "@/features/invitations/configs/invitations.configs";
import { InvitationsController } from "@/features/invitations/controllers/InvitationsController";
import type { FileDownloaderState } from "@/hooks/types/use-file-downloader.types.";
import { useFileDownloader } from "@/hooks/useFileDownloader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

export type InvitationsProps = {
  fileName?: string;
};

/**
 * Component for managing invitations via QR code.
 *
 * @description Allows users to manage their invitations through a QR code interface. It provides options to export the QR code as a .JPG or .PNG file.
 *
 * @param fileName - Optional name for the exported QR code image, defaults to 'TeachBoard_QR_Code_Invitation'.
 */
export function Invitations({
  fileName = "TeachBoard_QR_Code_Invitation",
}: InvitationsProps) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { setFileState } = useFileDownloader();
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  usePageTitle("Invitations");

  const drawerProps = {
    drawerHeader: {
      drawerTitle: { label: "Invitations" },
      drawerDescription: {
        label: "Gérez vos invitations via QR code",
      },
    },
    drawerFooter: {
      drawerClose: {
        label: "Fermer",
      },
    },
    drawerContent: {
      ref: canvasRef,
    },
    open,
    onClose: () => {
      setOpen(false);
      navigate(-1);
    },
  } satisfies ComponentProps<typeof InvivationsPage>;

  /**
   * Handles user actions for exporting the QR code as an image file.
   *
   * @description This reads the text content of the clicked button to determine the desired export format (JPG or PNG)
   *
   * @param e - The mouse event triggered by clicking one of the export buttons
   */
  const handleUserActions = (e: MouseEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    switchActionsCases(
      e.currentTarget.textContent,
      setFileState,
      canvasRef.current,
      fileName,
    );
  };

  return (
    <InvivationsPage {...drawerProps}>
      <InvivationsPage.Header />
      <InvivationsPage.Content />
      <InvivationsPage.Footer>
        <LargeButtonList
          items={qrCodeInvitationsButtonsConfig}
          onClick={handleUserActions}
        />
      </InvivationsPage.Footer>
    </InvivationsPage>
  );
}

const InvivationsPage = withVerticalDrawer(InvitationsController);

/**
 * Handles the logic for exporting the QR code as an image file based on the user's selection.
 *
 * @param textContent - The text content of the clicked button, used to determine the export format (JPG or PNG).
 * @param setFileState - Function to update the state for the file downloader, which triggers the download process.
 * @param canvasRef - A reference to the canvas element containing the QR code, used to generate the image data for export.
 * @param fileName - The base name for the exported file, which will be appended with the appropriate extension based on the selected format.
 */
function switchActionsCases(
  textContent: string | null,
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

  switch (textContent) {
    case "Exporter en .JPG":
      type = "image/jpeg";
      fileNameWithExtension = `${fileName}.jpg`;
      break;
    case "Exporter en .PNG":
      type = "image/png";
      fileNameWithExtension = `${fileName}.png`;
      break;
    case "Imprimer":
      type = "print";
      break;
    default:
      break;
  }

  stateSetter({
    data: canvas,
    type,
    fileName: fileNameWithExtension,
  });
}
