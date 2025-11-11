import type { LoginButtonProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { Icon } from "@/components/Icons/Icon.tsx";
import { Button } from "@/components/ui/button";
import type { LoginButtonsSvgsType } from "@/configs/social.config.ts";

/**
 * Login button component
 * @description Renders a login button with an icon and name.
 *
 * @link configs/social.config.ts for the item structure
 *
 * @param item - Icon item data
 */
export function LoginButton<T extends LoginButtonsSvgsType>({
  icon,
  ...rest
}: Readonly<LoginButtonProps<T>>) {
  return (
    <Button variant="outline" type="button" {...rest}>
      <Icon icon={icon} />
      {icon.name}
    </Button>
  );
}
