import type { UserDisplayProps } from "@/components/Sidebar/footer/types/FooterTypes.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "@css/UserDisplay.scss";

/**
 * User display component for Sidebar footer
 *
 * @description This is used in the sidebar footer to display user information
 * and the popup settings.
 *
 * @param props - User properties: avatar, name, email
 */
export function UserDisplay({ props }: UserDisplayProps) {
  const { avatar, name, email } = props;

  return (
    <div className="user-display-container">
      <Avatar className="user-display__avatar grayscale">
        <AvatarImage className="avatar__img" src={avatar} alt={name} />
        <AvatarFallback className="avatar__img-fallback">TB</AvatarFallback>
      </Avatar>
      <div className="user-display__info">
        <p className="info__name">{name}</p>
        <p className="info__email">{email}</p>
      </div>
    </div>
  );
}
