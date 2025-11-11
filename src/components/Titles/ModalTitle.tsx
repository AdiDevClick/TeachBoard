import type { ModalTitleProps } from "@/components/Titles/types/titles.types.ts";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";

/**
 * ModalTitle component for displaying a title and description in a modal dialog.
 *
 * @param className - Additional class names for styling.
 * @param props - Additional props to be passed to the CardHeader component.
 *
 * @returns
 */
export function ModalTitle({ className, ...props }: Readonly<ModalTitleProps>) {
  return (
    <CardHeader className={cn("text-center", className)} {...props}>
      <CardTitle className="text-xl">Welcome back</CardTitle>
      <CardDescription>
        Connectez-vous avec un de vos comptes sociaux ou par email
      </CardDescription>
    </CardHeader>
  );
}
