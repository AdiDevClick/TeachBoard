import type { ResolveNavigationProps } from "@/features/evaluations/create/types/create.types";

type NavigationResult = {
  nextIndex: number;
  incomingDirection: SlideDirection;
  outgoingDirection: SlideDirection;
};

export type SlideDirection = "left" | "right";

/**
 * Resolve the next tab index and animation directions based on the clicked button and current index.
 *
 * @param currentStep - The data-name of the clicked button, either "step-previous" or "next-step"
 * @param index - The current index of the tab
 * @param arrayLength - The total number of tabs
 * @returns An object containing the next index and animation directions, or null if navigation is not possible
 */
export function resolveNavigation({
  currentStep,
  index,
  arrayLength,
}: ResolveNavigationProps): NavigationResult | null {
  if (currentStep === "step-previous" && index > 0) {
    return {
      nextIndex: index - 1,
      incomingDirection: "left",
      outgoingDirection: "right",
    };
  }

  if (currentStep === "next-step" && index < arrayLength - 1) {
    return {
      nextIndex: index + 1,
      incomingDirection: "right",
      outgoingDirection: "left",
    };
  }

  return null;
}
