import type { SimpleAddButtonProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { PlusIcon } from "lucide-react";

/**
 * A simple button with a plus icon and a tooltip.
 *
 * @param toolTipText The label to show in the tooltip
 * @param props Additional button props
 */
export function SimpleAddButtonWithToolTip(props: SimpleAddButtonProps) {
  const { toolTipText } = props;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" {...props}>
          <PlusIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{toolTipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
