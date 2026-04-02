/**
 * @fileoverview Exports all buttons components from the Buttons folder.
 * This allows for cleaner and more organized imports in other parts of the application.
 */

import { LoginButton } from "@/components/Buttons/LoginButton";
import { PaginationButton } from "@/components/Buttons/PaginationButton";
import { SimpleAddButton } from "@/components/Buttons/SimpleAddButton";
import withListMapper from "@/components/HOCs/withListMapper";
import { withToolTip } from "@/components/HOCs/withToolTip";
import { Button } from "@/components/ui/button";
import { createComponentName } from "@/utils/utils";
import { lazy } from "react";

/**
 * Exporting the LoginButton component wrapped with the withListMapper HOC for use in lists.
 */
export const LoginButtonList = withListMapper(LoginButton);
createComponentName("withListMapper", "LoginButtonList", LoginButtonList);

/**
 * LAZY-LOADED VERSIONS
 */

export const LazyLoginButton = lazy(async () => {
  const module = await import("@/components/Buttons/LoginButton");
  return {
    default: module.LoginButton,
  };
});

/**
 * Exporting the lazy-loaded version of the LoginButton component wrapped with the withListMapper HOC for use in lists.
 */
export const LazyLoginButtonList = withListMapper(LazyLoginButton);
createComponentName(
  "withListMapper",
  "LazyLoginButtonList",
  LazyLoginButtonList,
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
