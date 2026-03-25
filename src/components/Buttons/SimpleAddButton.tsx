import type { SimpleAddButtonProps } from "@/components/Buttons/types/ButtonTypes";
import { Button } from "@/components/ui/button.tsx";
import sanitizeDOMProps from "@/utils/props";
import { PlusIcon } from "lucide-react";

/**
 * A simple button with a plus icon and a tooltip.
 *
 * @param toolTipText The label to show in the tooltip
 * @param props Additional button props
 */
export function SimpleAddButton(props: SimpleAddButtonProps) {
  const safeRest = sanitizeDOMProps(props, ["toolTipText"]);

  return (
    <Button variant="outline" type="button" {...safeRest}>
      <PlusIcon />
    </Button>
  );
}
