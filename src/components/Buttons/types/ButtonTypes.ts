import type { Button } from "@/components/ui/button.tsx";
import type { LoginButtonsSvgsType } from "@/configs/social.config";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ComponentProps, MouseEvent } from "react";

/**
 * LOGIN BUTTON types
 */

/** Login button can be used as a regular button or as a child component if props are injected */
export type LoginButtonProps = ComponentProps<"button"> &
  (LoginButtonsSvgsType | SafeListMapperProp<LoginButtonsSvgsType>);

/** SimpleAddButton types */
export type SimpleAddButtonWithToolTipProps = ComponentProps<typeof Button> & {
  toolTipText?: string;
  onClick?: (
    event: MouseEvent<HTMLButtonElement>,
    rest: Omit<ComponentProps<typeof Button>, "onClick">
  ) => void;
};
