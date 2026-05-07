import { buildAuthURL } from "@/components/Buttons/functions/login-button.functions";
import type { LargeButtonWithIconAndLinkProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { Icon } from "@/components/Icons/Icon.tsx";
import { Button } from "@/components/ui/button";
import {
  debugLogs,
  LargeButtonWithIconAndLinkContainsInvalid,
} from "@/configs/app-components.config.ts";
import { sanitizeDOMProps } from "@/utils/props";
import { Link } from "react-router-dom";

/**
 * Login button component
 * @description Renders a login button with an icon and label.
 *
 * Can be used with ListMapper which will automatically provide the icon prop.
 * When used standalone, the icon prop must be provided manually.
 *
 * @link configs/social.config.ts for the item structure
 *
 * @param label - The display label of the login button
 * @param iconPath - The path to the icon SVG
 * @param url - The URL to navigate to on button click
 * @param buttonProps - Additional button HTML attributes
 */
export function LargeButtonWithIconAndLink(
  props: Readonly<LargeButtonWithIconAndLinkProps>,
) {
  if (LargeButtonWithIconAndLinkContainsInvalid(props)) {
    debugLogs("LargeButtonWithIconAndLink", { type: "propsValidation", props });
    return null;
  }

  const { label, iconPath, url = "#", auth = false, ...buttonProps } = props;

  const sanitizedProps = sanitizeDOMProps(buttonProps, ["getLink"]);

  const checkedURL = auth ? buildAuthURL(url) : url;

  return (
    <Button asChild variant="outline" type="button" {...sanitizedProps}>
      <Link to={checkedURL} rel="noopener noreferrer">
        {iconPath && <Icon iconPath={iconPath} />}
        {label}
      </Link>
    </Button>
  );
}
