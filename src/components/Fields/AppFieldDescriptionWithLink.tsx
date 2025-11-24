import type { AppFieldDescriptionWithLinkProps } from "@/components/Fields/types/fields.types.ts";
import { FieldDescription } from "@/components/ui/field.tsx";
import { cn } from "@/utils/utils.ts";
import { Link } from "react-router-dom";

/**
 * Field description component with an embedded link.
 * @param children - The description text
 * @param linkText - The text for the link
 * @param linkTo - The URL the link points to
 * @param props - Additional HTML attributes for the paragraph element
 */
export function AppFieldDescriptionWithLink({
  children,
  linkText,
  linkTo,
  ...props
}: AppFieldDescriptionWithLinkProps) {
  return (
    <FieldDescription className={cn("text-center", props.className)}>
      {children}
      <Link {...props} to={linkTo}>
        {linkText}
      </Link>
    </FieldDescription>
  );
}
