/**
 * @fileoverview Type definitions for the withStyledForm HOC.
 */

import type { WithTitledCardProps } from "@/components/HOCs/types/with-titled-card.types";
import type LoginView from "@/features/auth/components/login/LoginView";
import type { ForgottenPwAndDefaultLinkTexts } from "@/features/auth/types/auth-types";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Type definition for the props accepted by the withStyledForm HOC.
 *
 * @remarks This type extends the props of the LoginView component and adds specific props for form handling and display.
 */
type LoginViewProps = Parameters<typeof LoginView>[0];

export type WithStyledFormProps<T extends FieldValues> = Readonly<
  {
    formId: string;
    form: UseFormReturn<T>;
  } & ForgottenPwAndDefaultLinkTexts &
    WithTitledCardProps<LoginViewProps>
>;
