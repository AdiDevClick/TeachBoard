import type { Button } from "@/components/ui/button.tsx";
import type { LoginButtonsSvgsType } from "@/configs/social.config";
import type { HandleAddNewItemParams } from "@/hooks/database/types/use-command-handler.types.ts";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ComponentProps } from "react";

/**
 * LOGIN BUTTON types
 */

/** Login button can be used as a regular button or as a child component if props are injected */
export type LoginButtonProps = ComponentProps<"button"> &
  (LoginButtonsSvgsType | SafeListMapperProp<LoginButtonsSvgsType>);

/** SimpleAddButton types */
export type SimpleAddButtonWithToolTipProps = Omit<
  ComponentProps<typeof Button>,
  "onClick"
> & {
  toolTipText?: string;
  /**
   * Click handler can either accept the custom payload object used by the
   */
  onClick?:
    | ((
        payload: HandleAddNewItemParams &
          Omit<ComponentProps<typeof Button>, "onClick">
      ) => void)
    | ComponentProps<typeof Button>["onClick"];
};
