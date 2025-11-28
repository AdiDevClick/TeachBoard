import type { LoginButtonProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { Icon } from "@/components/Icons/Icon.tsx";
import { Button } from "@/components/ui/button";

/**
 * Login button component
 * @description Renders a login button with an icon and name.
 *
 * Can be used with ListMapper which will automatically provide the icon prop.
 * When used standalone, the icon prop must be provided manually.
 *
 * @link configs/social.config.ts for the item structure
 *
 * @param name - The display name of the login button
 * @param path - The path to the icon SVG
 * @param url - The URL to navigate to on button click
 * @param buttonProps - Additional button HTML attributes
 */
export function LoginButton(props: Readonly<LoginButtonProps>) {
  const { name, path, url, ...buttonProps } = props;

  if (!path || !name) {
    return null;
  }

  return (
    <Button variant="outline" type="button" {...buttonProps}>
      <Icon iconPath={path} />
      {name}
    </Button>
  );
}
