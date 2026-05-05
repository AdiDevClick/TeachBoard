import { VerticalDotButton } from "@/components/Buttons/VerticalDotButton";
import { withDropdownLayout } from "@/components/HOCs/withDropdownLayout";
import { ListMapper } from "@/components/Lists/ListMapper";
import { ACTIONS_LIST } from "@/components/Tables/configs/table.config";
import { handleActionOnClick } from "@/components/Tables/functions/evaluation-actions-cell.functions";
import type { EvaluationActionsCellProps } from "@/components/Tables/types/evaluation-table.types";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { type ComponentProps } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Actions cell
 *
 * @description A menu with actions for each evaluation: Consulter (opens the detail drawer), Editer, Supprimer.
 */
export function EvaluationActionsCell<T extends DetailedEvaluationView>({
  item,
  actionsList = ACTIONS_LIST,
}: EvaluationActionsCellProps<T>) {
  const navigate = useNavigate();
  const layoutProps = {
    menu: {
      content: {
        className: "w-fit",
      },
    },
  } satisfies ComponentProps<typeof ActionsMenu>;

  return (
    <ActionsMenu {...layoutProps}>
      <ActionsMenu.Trigger>
        <VerticalDotButton
          accessibilityLabel="Ouvrir le menu"
          toolTipText="Actions"
        />
      </ActionsMenu.Trigger>
      <ActionsMenu.Content>
        <ListMapper items={actionsList}>
          {({ label, ...rest }) => {
            const isDeleteAction = label === "Supprimer";

            return (
              <>
                {isDeleteAction && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={(e) =>
                    handleActionOnClick(e, label, item.id, navigate)
                  }
                  {...rest}
                >
                  {label}
                </DropdownMenuItem>
              </>
            );
          }}
        </ListMapper>
      </ActionsMenu.Content>
    </ActionsMenu>
  );
}

const ActionsMenu = withDropdownLayout(() => null);
