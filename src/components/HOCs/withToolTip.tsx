import type { WithToolTipProps } from "@/components/HOCs/types/with-tooltip.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  debugLogs,
  withToolTipPropsInvalid,
} from "@/configs/app-components.config";
import { createNameForHOC } from "@/utils/utils";
import type { ComponentType } from "react";

/**
 * HOC to wrap a component with a tooltip.
 *
 * @param toolTipText - The text to display inside the tooltip. If not provided, defaults to "No tooltip text".
 */
export function withToolTip<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  function WithToolTip(props: P & WithToolTipProps) {
    if (withToolTipPropsInvalid(props)) {
      debugLogs("Rendering withToolTip", { type: "propsValidation", props });
    }

    const { toolTipText = "No tooltip text", ...rest } = props;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <WrappedComponent {...(rest as P)} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{toolTipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  createNameForHOC("withToolTip", WrappedComponent, WithToolTip);

  return WithToolTip;
}
