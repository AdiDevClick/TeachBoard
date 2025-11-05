import type { LoginButtonsSvgsType } from "@/configs/social.config.ts";
import type { HTMLAttributes } from "react";

export type IconPropsTypes = {
  icon: LoginButtonsSvgsType;
} & HTMLAttributes<SVGElement>;
