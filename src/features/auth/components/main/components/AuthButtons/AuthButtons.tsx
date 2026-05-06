import { LargeButtonList } from "@/components/Buttons/exports/buttons.exports";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { loginButtonsSvgs } from "@/configs/social.config";
import type { AuthButtonsProps } from "@/features/auth/components/main/components/AuthButtons/types/auth-buttons.types";

/**
 * View component for the login page.
 *
 * @description This is the main view component for the login page, which renders the login form and the password recovery form based on the state.
 *
 * @param children - The child components to render within the page view.
 */
export function AuthButtons({ children }: Readonly<AuthButtonsProps>) {
  return (
    <FieldGroup>
      <Field>
        <LargeButtonList items={loginButtonsSvgs} />
      </Field>
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        Ou continuez avec
      </FieldSeparator>
      {children}
    </FieldGroup>
  );
}
