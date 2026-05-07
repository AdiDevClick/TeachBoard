import type { Button } from "@/components/ui/button.tsx";
import type { ComponentProps, ComponentType } from "react";

/**
 * BUTTON types
 */

/**
 * Large button with icon and link types
 *
 * @description This button will render as wide as its container allows, and will include an icon and a label.
 * It can also function as a link, navigating to the specified URL when clicked.
 *
 * @remark If the `auth` prop is set to true, it will be used for authentication purposes, building the authentication flow URI based on the provided `url` for the specified provider (e.g., Google, Facebook).
 */
export type LargeButtonWithIconAndLinkProps = SimpleAddButtonProps & {
  /**
   * The path to the icon to display on the button. This should correspond to an SVG file in the icons directory.
   * For example, if you have an icon file named `share.svg`, you would set `iconPath` to `"share"`.
   */
  iconPath?: string;
  /** The text to display on the button */
  label: string;
  /**
   * The URL to navigate to when the button is clicked
   * @default "#"
   */
  url?: string;
  /**
   *  Whether the button is used for authentication - This will build the authentication flow URI by using the specified `url` from the props for the specified provider (e.g., Google, Facebook)
   * @default false
   */
  auth?: boolean;
};

/** SimpleAddButton types */
export type SimpleAddButtonProps = ComponentProps<typeof Button>;

/** PaginationButton types */
export type PaginationButtonProps = Readonly<
  {
    label: string;
    icon: ComponentType;
  } & SimpleAddButtonProps
>;

/**
 * COMMON TOOLTIP BUTTON types
 */
export type CommonTooltipButtonProps = ComponentProps<typeof Button> & {
  accessibilityLabel: string;
  toolTipText?: string;
};
