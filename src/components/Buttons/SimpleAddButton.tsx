import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {
  debugLogs,
  simpleAddButtonWithToolTipPropsInvalid,
} from "@/configs/app-components.config.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { PlusIcon } from "lucide-react";
import type { MouseEvent, PointerEvent } from "react";

/**
 * A simple button with a plus icon and a tooltip.
 *
 * @param toolTipText The label to show in the tooltip
 * @param props Additional button props
 */
export function SimpleAddButtonWithToolTip(
  props: SimpleAddButtonWithToolTipProps
) {
  if (simpleAddButtonWithToolTipPropsInvalid(props)) {
    debugLogs("Rendering SimpleAddButtonWithToolTip");
  }

  const { toolTipText, onClick: externalOnClick, ...rest } = props;

  /**
   * Handle click event for the button.
   *
   * @description Adds other data to the event handler if needed.
   *
   * @param event - The mouse event triggered by clicking the button
   */
  const handleLocalClick = (
    e: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => {
    preventDefaultAndStopPropagation(e);

    if (externalOnClick) {
      externalOnClick({ e, ...rest });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" {...rest} onClick={handleLocalClick}>
          <PlusIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{toolTipText ?? "Tooltip text"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
