import type { HeaderTitleProps } from "@/components/Titles/types/titles.types.ts";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { DialogHeader } from "@/components/ui/dialog.tsx";
import { cn } from "@/utils/utils";
import type { ComponentType } from "react";

/**
 * ModalTitle component for displaying a title and description in a modal dialog.
 *
 * @param className - Additional class names for styling.
 * @param props - Additional props to be passed to the CardHeader component.
 *
 * @returns
 */
export function HeaderTitle({
  className,
  ...props
}: Readonly<HeaderTitleProps>) {
  return (
    <CardHeader className={cn("text-center", className)} {...props}>
      <CardTitle className="text-xl">Welcome back</CardTitle>
      <CardDescription>
        Connectez-vous avec un de vos comptes sociaux ou par email
      </CardDescription>
    </CardHeader>
  );
}

function withDialogHeader(Component: ComponentType): ComponentType {
  return (props) => (
    <DialogHeader>
      <Component {...props} />
    </DialogHeader>
  );
}

export const WithDialogHeader = withDialogHeader(HeaderTitle);
