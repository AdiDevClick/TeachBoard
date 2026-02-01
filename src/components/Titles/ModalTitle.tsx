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
 * Renders a centered header section with a title and description inside a `CardHeader`.
 *
 * @param className - Additional CSS classes to apply to the header container.
 * @param title - Text displayed as the header title.
 * @param description - Text displayed as the header description.
 * @param id - Base id used to generate a unique header id.
 * @param props - Additional props to be spread onto the `CardHeader` component.
 *
 * @returns A `CardHeader` element containing a `CardTitle` and `CardDescription`.
 */
export function HeaderTitle({
  className = "",
  title = headerTitle,
  description = headerDescription,
  id = "login-header",
  displayChildrenOnly = false,
  ...props
}: HeaderTitleProps) {
  const ids = useId();
  return (
    <CardHeader
      id={id + ids}
      className={cn("text-center", className)}
      {...props}
    >
      {!displayChildrenOnly && (
        <>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </>
      )}
      {props.children}
    </CardHeader>
  );
}

/**
 * Renders a centered dialog header composed of a title and description.
 *
 * @description A generated unique id is appended to the provided `id` prop to ensure uniqueness.
 *
 * @remarks Passing a `className` props will merge it with "text-center" for consistent styling.
 *
 * @param title - The title content to display in the DialogTitle. **Defaults** to `headerTitle`.
 * @param description - The descriptive content to display in the DialogDescription. **Defaults** to `headerDescription`.
 * @param id - Base id string for the header; a unique suffix from useId() is appended. **Defaults** to `login-header-dialog`.
 * @param rest - Additional props forwarded to the underlying DialogHeader component.
 *
 * @returns A React element containing the composed DialogHeader, DialogTitle, and DialogDescription.
 *
 * @example
 * <DialogHeaderTitle title="Sign in" description="Use your account to sign in." />
 */
export function DialogHeaderTitle({
  title = headerTitle,
  description = headerDescription,
  id = "login-header-dialog",
  displayChildrenOnly = false,
  ...props
}: HeaderTitleProps) {
  const ids = useId();
  return (
    <DialogHeader
      id={id + ids}
      className={cn("text-center", props.className)}
      {...props}
    >
      {!displayChildrenOnly && (
        <>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </>
      )}
      {props.children}
    </DialogHeader>
  );
}
