import type { LoginButtonsSvgsType } from "@/configs/social.config";
import type { ComponentProps } from "react";

type LoginButtonBaseProps = ComponentProps<"button">;

/** Props injected when used with ListMapper */
type LoginButtonMappedMeta = {
  __mapped?: true;
  index: number;
} & LoginButtonsSvgsType;

/**
 * Props for LoginButton component
 *
 * When used directly: name, path, and url are required
 * When used with ListMapper: props are optional and spread automatically
 *
 * @example
 * // Direct usage - all props required
 * <LoginButton name="Login with Google" path="google" url="..." />
 *
 * // With ListMapper - use as={} cast
 * <ListMapper items={loginButtons}>
 *   <LoginButton {...({} as LoginButtonProps)} />
 * </ListMapper>
 */
export type LoginButtonProps = LoginButtonBaseProps &
  (LoginButtonsSvgsType | LoginButtonMappedMeta);
