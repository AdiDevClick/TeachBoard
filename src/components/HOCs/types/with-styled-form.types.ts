/**
 * @fileoverview Type definitions for the withStyledForm HOC.
 */

import type { WithTitledCardProps } from "@/components/HOCs/types/with-titled-card.types";
import type LoginView from "@/features/auth/components/login/LoginView";
import type {
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/features/auth/components/login/models/login.models";
import type { UseFormReturn } from "react-hook-form";

/**
 * Type definition for the props accepted by the withStyledForm HOC.
 *
 * @remarks This type extends the props of the LoginView component and adds specific props for form handling and display.
 */
type LoginViewProps = Parameters<typeof LoginView>[0];

export type WithStyledFormProps = Readonly<
  {
    formId: string;
    textToDisplay: {
      defaultText: string;
      pwForgottenLinkTo: string;
      buttonText: string;
    };
    form: UseFormReturn<LoginFormSchema> | UseFormReturn<RecoveryFormSchema>;
  } & WithTitledCardProps<LoginViewProps>
>;
