import type { ComponentProps } from "react";

export type LoginButtonProps<T> = {
  icon: T;
} & ComponentProps<"button">;
