import type { HeaderTitleProps } from "@/components/Titles/types/titles.types.ts";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { headerDescription, headerTitle } from "@/data/login-header.data.ts";
import { cn } from "@/utils/utils";
import { useId } from "react";

/**
 * ModalTitle component for displaying a title and description in a modal dialog.
 *
 * @param className - Additional class names for styling.
 * @param props - Additional props to be passed to the CardHeader component.
 *
 * @returns
 */
export function HeaderTitle({
  className = "",
  title = headerTitle,
  description = headerDescription,
  id = "login-header",
  ...props
}: Readonly<HeaderTitleProps>) {
  const ids = useId();
  return (
    <CardHeader
      id={id + ids}
      className={cn("text-center", className)}
      {...props}
    >
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}

/**
 * Higher-order component that wraps a component with a dialog header.
 *
 * @param Component - The component to be wrapped.
 */
export function DialogHeaderTitle({
  title = headerTitle,
  description = headerDescription,
  className = "",
  id = "login-header-dialog",
  ...rest
}: Readonly<HeaderTitleProps>) {
  const ids = useId();
  return (
    <DialogHeader
      id={id + ids}
      className={cn("text-center", className)}
      {...rest}
    >
      <DialogTitle className="text-xl">{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  );
}
