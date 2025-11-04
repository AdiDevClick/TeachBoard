import type { LoginButtonsSvgsType } from "@/configs/social.config.ts";

export type LoginButtonProps<
  T extends LoginButtonsSvgsType = LoginButtonsSvgsType
> = Partial<T>;
