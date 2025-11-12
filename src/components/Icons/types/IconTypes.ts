import type { LoginButtonsSvgsType } from "@/configs/social.config.ts";
import type { HTMLAttributes } from "react";

export type IconPropsTypes = {
  iconPath: LoginButtonsSvgsType["path"];
} & HTMLAttributes<SVGElement>;
