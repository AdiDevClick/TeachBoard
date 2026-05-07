import type { Icon } from "@/components/Icons/Icon";
import type { Button } from "@/components/ui/button.tsx";
import type { ComponentProps, ComponentType } from "react";

/**
 * LOGIN BUTTON types
 */

/** Login button can be used as a regular button or as a child component if props are injected */
export type LargeButtonWithIconAndLinkProps = SimpleAddButtonProps &
  ComponentProps<typeof Icon> & {
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
