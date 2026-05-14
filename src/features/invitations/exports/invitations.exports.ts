import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { InvitationsController } from "@/features/invitations/controllers/InvitationsController";

/**
 * Page component for managing invitations via QR code.
 *
 * @description This component is wrapped with a vertical drawer HOC to provide a consistent UI for managing invitations. It renders the InvitationsController, which handles the logic for displaying and exporting the QR code for invitations.
 *
 * @see InvitationsController for the main logic and UI of the invitations feature.
 */
export const InvitationsPage = withVerticalDrawer(InvitationsController);
