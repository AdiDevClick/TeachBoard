import type { AvatarDisplayProps } from "@/components/Sidebar/footer/types/footer.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx";
import "@css/AvatarDisplay.scss";

/**
 * Avatar display component for Sidebar footer
 *
 * @description This is used in the sidebar footer to display user information
 * and the popup settings.
 *
 * @param props - User properties: avatar, name, email
 */
export function AvatarDisplay({
  children,
  props,
}: Readonly<AvatarDisplayProps>) {
  const { avatar, name, email } = props;

  return (
    <Item className="user-display-container">
      <ItemMedia>
        <Avatar className="user-display__avatar grayscale">
          <AvatarImage className="avatar__img" src={avatar} alt={name} />
          <AvatarFallback className="avatar__img-fallback">TB</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent className="user-display__info">
        <ItemTitle className="info__name">{name}</ItemTitle>
        <ItemDescription className="info__email">{email}</ItemDescription>
      </ItemContent>
      <ItemActions>{children}</ItemActions>
    </Item>
  );
}
