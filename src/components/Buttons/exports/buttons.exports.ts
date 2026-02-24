/**
 * @fileoverview Exports all buttons components from the Buttons folder.
 * This allows for cleaner and more organized imports in other parts of the application.
 */

import { LoginButton } from "@/components/Buttons/LoginButton";
import withListMapper from "@/components/HOCs/withListMapper";
import { lazy } from "react";

/**
 * Exporting the LoginButton component wrapped with the withListMapper HOC for use in lists.
 */
export const LoginButtonList = withListMapper(LoginButton);

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
