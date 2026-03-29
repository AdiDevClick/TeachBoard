import { VerticalDotButton } from "@/components/Buttons/VerticalDotButton";
import { withDropdownLayout } from "@/components/HOCs/withDropdownLayout";
import { ListMapper } from "@/components/Lists/ListMapper";
import { ACTIONS_LIST } from "@/components/Tables/configs/table.config";
import type { EvaluationActionsCellProps } from "@/components/Tables/types/evaluation-table.types";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EvaluationDetailDrawer } from "@/features/evaluations/main/components/EvaluationDetailDrawer";
import { useState } from "react";

/**
 * Actions cell
 *
 * @description A menu with actions for each evaluation: Consulter (opens the detail drawer), Editer, Supprimer.
 */
export function EvaluationActionsCell({
  item,
  actionsList = ACTIONS_LIST,
}: EvaluationActionsCellProps) {
  const [open, setOpen] = useState(false);
  const layoutProps = {
    menu: {
      content: {
        className: "w-fit",
      },
    },
  };

  const handleOnClick = (label: string) => {
    if (label === "Consulter") {
      setOpen(true);
    }
  };

  return (
    <>
      <ActionsMenu {...layoutProps}>
        <ActionsMenu.Trigger>
          <VerticalDotButton
            accessibilityLabel="Ouvrir le menu"
            toolTipText="Actions"
          />
        </ActionsMenu.Trigger>
        <ActionsMenu.Content>
          <ListMapper items={actionsList}>
            {({ label, ...rest }) => (
              <>
                {label === "Supprimer" && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => handleOnClick(label)}
                  {...rest}
                >
                  {label}
                </DropdownMenuItem>
              </>
            )}
          </ListMapper>
        </ActionsMenu.Content>
      </ActionsMenu>
      <EvaluationDetailDrawer
        evaluation={open ? item : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const ActionsMenu = withDropdownLayout(() => null);
