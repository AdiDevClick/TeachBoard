import { LargeButtonList } from "@/components/Buttons/exports/buttons.exports";
import { qrCodeInvitationsButtonsConfig } from "@/features/invitations/configs/invitations.configs";
import type { QRCodeInvitationButtonAction } from "@/features/invitations/configs/types/invitations-configs.types";
import { switchActionsCases } from "@/features/invitations/controllers/functions/invitations-controller.functions";
import { InvitationsPage } from "@/features/invitations/exports/invitations.exports";
import type { InvitationsProps } from "@/features/invitations/types/invitations.types";
import { useDrawer } from "@/hooks/useDrawer";
import { useFileDownloader } from "@/hooks/useFileDownloader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { AppDrawer } from "@/pages/AllDrawers/AppDrawer";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useRef, type ComponentProps, type MouseEvent } from "react";

/**
 * Component for managing invitations via QR code.
 *
 * @description Allows users to manage their invitations through a QR code interface. It provides options to export the QR code as a .JPG or .PNG file.
 *
 * @param fileName - Optional name for the exported QR code image, `@default="TeachBoard_QR_Code_Invitation"`.
 */
export function Invitations({
  pageId = "invitations",
  fileName = "TeachBoard_QR_Code_Invitation",
}: InvitationsProps) {
  const { setFileState } = useFileDownloader();
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  usePageTitle("Invitations");
  const { waitAnimationAndNavigate } = useDrawer({ pageId });

  const drawerContentProps = {
    className: "justify-center",
    onAnimationEnd: waitAnimationAndNavigate,
  } satisfies ComponentProps<typeof AppDrawer>["appDrawerContentProps"];

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
  } satisfies ComponentProps<typeof InvitationsPage>;

  /**
   * Handles user actions for exporting the QR code as an image file.
   *
   * @description This uses the action declared in the button config to determine the desired export format.
   *
   * @param e - The mouse event triggered by clicking one of the export buttons
   * @param action - The stable action key declared in the invitations button config
   */
  const handleUserActions = (
    e: MouseEvent<HTMLButtonElement>,
    action: QRCodeInvitationButtonAction,
  ) => {
    preventDefaultAndStopPropagation(e);
    switchActionsCases(action, setFileState, canvasRef.current, fileName);
  };

  return (
    <AppDrawer
      appDrawerName={pageId}
      appDrawerContentProps={drawerContentProps}
    >
      <InvitationsPage {...drawerProps}>
        <InvitationsPage.Header />
        <InvitationsPage.Content />
        <InvitationsPage.Footer>
          <LargeButtonList
            items={qrCodeInvitationsButtonsConfig}
            optional={(button) => ({
              onClick: (e) => handleUserActions(e, button.action),
            })}
          />
        </InvitationsPage.Footer>
      </InvitationsPage>
    </AppDrawer>
  );
}
