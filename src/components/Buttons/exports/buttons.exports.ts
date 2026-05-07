/**
 * @fileoverview Exports all buttons components from the Buttons folder.
 * This allows for cleaner and more organized imports in other parts of the application.
 */

import { LargeButtonWithIconAndLink } from "@/components/Buttons/LargeButtonWithIconAndLink";
import { PaginationButton } from "@/components/Buttons/PaginationButton";
import { SimpleAddButton } from "@/components/Buttons/SimpleAddButton";
import withListMapper from "@/components/HOCs/withListMapper";
import { withToolTip } from "@/components/HOCs/withToolTip";
import { Button } from "@/components/ui/button";
import { createComponentName } from "@/utils/utils";
import { lazy } from "react";

/**
 * Exporting the LargeButtonWithIconAndLink component wrapped with the withListMapper HOC for use in lists.
 */
export const LargeButtonList = withListMapper(LargeButtonWithIconAndLink);
createComponentName("withListMapper", "LargeButtonList", LargeButtonList);

/**
 * LAZY-LOADED VERSIONS
 */

export const LazyLargeButtonWithIconAndLink = lazy(async () => {
  const module =
    await import("@/components/Buttons/LargeButtonWithIconAndLink");
  return {
    default: module.LargeButtonWithIconAndLink,
  };
});

/**
 * Exporting the lazy-loaded version of the LargeButtonWithIconAndLink component wrapped with the withListMapper HOC for use in lists.
 */
export const LazyLargeButtonList = withListMapper(
  LazyLargeButtonWithIconAndLink,
);
createComponentName(
  "withListMapper",
  "LazyLargeButtonList",
  LazyLargeButtonList,
);

/**
 * Exporting the SimpleAddButton component that can display a tooltip on hover, wrapped with the withToolTip HOC.
 */
export const SimpleAddButtonWithToolTip = withToolTip(SimpleAddButton);

createComponentName(
  "withToolTip",
  "SimpleAddButtonWithToolTip",
  SimpleAddButtonWithToolTip,
);

/**
 * Exporting the PaginationButton component wrapped with the withListMapper HOC for use in lists.
 */
export const PaginationButtons = withListMapper(PaginationButton);
createComponentName("withListMapper", "PaginationButtons", PaginationButtons);

/**
 * A version of the Button component that can display a tooltip on hover, wrapped with the withToolTip HOC.
 */
export const ButtonWithTooltip = withToolTip(Button);
createComponentName("withToolTip", "ButtonWithTooltip", ButtonWithTooltip);
