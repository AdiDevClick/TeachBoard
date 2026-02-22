import type { useMutationObserver } from "@/hooks/useMutationObserver";

/**
 * Find specific elements in the current panel to apply animations on them when the tab is changed.
 *
 * @param currentPanel - The current tab panel element from which to find the nested elements for animation.
 * @param filter - A function to filter and find the nested elements based on specific selectors.
 *
 * @returns An object containing the references to the elements that will be animated during the tab transition.
 */
export function getAnimatedElements(
  currentPanel: HTMLElement,
  filter: ReturnType<typeof useMutationObserver>["findAllNestedElements"],
) {
  return filter(currentPanel, {
    rightSide: "[class*='content__right-side']",
    rightSideStepThreeEvaluation: "#step-three-evaluation",
    leftNumber: "[class*='--number']",
    leftDescription: "[class*='--description']",
    leftSubskillSelection: "#step-three-subskills-selection",
    leftTitle: "[class*='--title']",
  });
}
