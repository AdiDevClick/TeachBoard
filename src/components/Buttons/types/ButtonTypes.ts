import type { LoginButtonsSvgsType } from "@/configs/social.config";
import type { ComponentProps } from "react";

/**
 * LOGIN BUTTON types
 */
export type LoginButtonProps = ComponentProps<"button"> & LoginButtonsSvgsType;
