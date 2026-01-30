import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import type { MouseEvent } from "react";

/**
 * Handle previous arrow click to go back to module selection
 *
 * @param e - Mouse event from the click
 * @param setter - Optional state setter to update module selection state
 */
export function handlePreviousClick(
  e: MouseEvent<SVGSVGElement>,
  displayEvaluations?: (value: boolean) => void,
) {
  preventDefaultAndStopPropagation(e);
  displayEvaluations?.(false);
}
