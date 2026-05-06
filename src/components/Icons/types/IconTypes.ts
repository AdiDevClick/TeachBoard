import type { LargeButtonWithIconAndLinksSvgsType } from "@/configs/social.config.ts";
import type { HTMLAttributes } from "react";

export type IconPropsTypes = {
  iconPath: LargeButtonWithIconAndLinksSvgsType["iconPath"];
} & HTMLAttributes<SVGElement>;
