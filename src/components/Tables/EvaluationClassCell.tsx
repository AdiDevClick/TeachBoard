import type { EvaluationClassCellProps } from "@/components/Tables/types/evaluation-table.types";
import { Button } from "@/components/ui/button";
import { EvaluationDetailDrawer } from "@/features/evaluations/main/components/EvaluationDetailDrawer";
import { useState } from "react";

/**
 * A custom cell renderer for the "className" column in the evaluation table.
 *
 * @description This component renders the class name as a button. When clicked, it opens a drawer with detailed information about the evaluation.
 *
 * @param item - The evaluation item containing the class name and other details to be displayed in the drawer.
 */
export function EvaluationClassCell({ item }: EvaluationClassCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="link"
        className="px-0 text-left text-foreground"
        onClick={() => setOpen(true)}
      >
        {item.className}
      </Button>
      <EvaluationDetailDrawer
        evaluation={open ? item : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
