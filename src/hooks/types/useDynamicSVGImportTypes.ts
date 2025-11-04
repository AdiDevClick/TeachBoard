import type { LoginButtonsSvgsType } from "@/configs/social.config.ts";

export type UseDynamicSVGImportTypes = {
  icon: LoginButtonsSvgsType;
  options?: {
    [key: string]: unknown;
  };
};
