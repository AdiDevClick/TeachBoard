import type { LoginButtonsSvgsType } from "@/configs/social.config";
import type { ExcludeProps } from "@/utils/types/types.utils.ts";
import type { ComponentProps } from "react";

/**
 * LOGIN BUTTON types
 */

/** Base props common to both modes */
type LoginButtonBaseProps = {
  index: number;
};

/** Props when used standalone - all LoginButtonsSvgsType props are required, __mapped is forbidden */
type LoginButtonStandaloneProps = LoginButtonBaseProps &
  LoginButtonsSvgsType & {
    __mapped?: false;
  };

/** Props when used with ListMapper - LoginButtonsSvgsType props are optional, __mapped is required */
type LoginButtonMappedProps = ExcludeProps<LoginButtonsSvgsType> &
  ExcludeProps<LoginButtonBaseProps> & {
    __mapped?: true;
  };

export type LoginButtonProps = ComponentProps<"button"> &
  (LoginButtonMappedProps | LoginButtonStandaloneProps);
