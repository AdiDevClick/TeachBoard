import type { Button } from "@/components/ui/button.tsx";
import type { LargeButtonWithIconAndLinksSvgsType } from "@/configs/social.config";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ComponentProps, ComponentType } from "react";

/**
 * LOGIN BUTTON types
 */

/** Login button can be used as a regular button or as a child component if props are injected */
export type LargeButtonWithIconAndLinkProps = ComponentProps<"button"> &
  (
    | LargeButtonWithIconAndLinksSvgsType
    | SafeListMapperProp<LargeButtonWithIconAndLinksSvgsType>
  );

/** SimpleAddButton types */
export type SimpleAddButtonProps = ComponentProps<typeof Button>;

/** PaginationButton types */
export type PaginationButtonProps = Readonly<
  {
    label: string;
    icon: ComponentType;
  } & ComponentProps<typeof Button>
>;

/**
 * COMMON TOOLTIP BUTTON types
 */
export type CommonTooltipButtonProps = ComponentProps<typeof Button> & {
  accessibilityLabel: string;
  toolTipText?: string;
};
