import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { ButtonsGroupList } from "@/components/Sidebar/nav/elements/menu_group_list/ButtonsGroupList";
import { qrCodeInvitationsButtonsConfig } from "@/features/invitations/configs/invitations.configs";
import { InvitationsController } from "@/features/invitations/controllers/InvitationsController";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { ComponentProps } from "react";

export function Invitations() {
  usePageTitle("Invitations");

  const drawerProps = {
    drawerFooter: {
      drawerClose: {
        label: "Fermer",
      },
    },
  } satisfies ComponentProps<typeof InvivationsPage>;

  return (
    <InvivationsPage {...drawerProps}>
      <InvivationsPage.Footer>
        <ButtonsGroupList
          items={qrCodeInvitationsButtonsConfig}
          optional={(button) => ({
            to: button.getLink(evaluation?.id ?? ""),
          })}
        />
      </InvivationsPage.Footer>
    </InvivationsPage>
  );
}

const InvivationsPage = withVerticalDrawer(InvitationsController);
