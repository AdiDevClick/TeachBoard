import type { UserDisplayProps } from "@/components/Sidebar/footer/types/FooterTypes.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg grayscale">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="rounded-lg">TB</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">{email}</span>
      </div>
    </div>
  );
}
