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

/**
 * ANIMATION - Unmounted elements
 *
 * @param elements - The elements to animate
 * @param isEvaluation - Whether the current evaluation step is the third one, which has specific elements to animate
 *
 * @description Applies the outgoing animations to the elements of the current tab content
 */
export function animateUnmountedElements(
  elements: ReturnType<typeof getAnimatedElements>,
  isEvaluation: boolean,
) {
  const {
    rightSide,
    leftNumber,
    leftDescription,
    leftTitle,
    rightSideStepThreeEvaluation,
    leftSubskillSelection,
  } = elements;

  // Normal right side animation (all tabs if no evaluation step is shown)
  if (rightSide && !isEvaluation) {
    rightSide.style.animation = "outgoing-rightside 500ms both";
  }

  // Evaluation is shown, others rightsides won't be animated and the left description won't be animated
  if (isEvaluation && rightSideStepThreeEvaluation && leftSubskillSelection) {
    rightSideStepThreeEvaluation.style.animation =
      "step-three-evaluation-out 500ms both";
    leftSubskillSelection.style.animation = "out-left-desc 200ms both 0.2s";
  }

  // This isn't an evaluation step, so it should be the description
  if (!isEvaluation) {
    leftDescription.style.animation = "out-left-desc 200ms both";
  }

  // Normal behavior
  leftNumber.style.animation = "out-left-number 500ms linear both";
  leftTitle.style.animation =
    "out-left-title 400ms cubic-bezier(0.22,1,0.36,1) both";
}
