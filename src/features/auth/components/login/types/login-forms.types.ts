import type {
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/features/auth/components/login/models/login.models";
import type { ForgottenPwLinkParams } from "@/features/auth/types/auth-types";
import type { MouseEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Parameters for handling the recover password click event.
 */
export type HandleRecoverPasswordClickParams = {
  e: MouseEvent<HTMLAnchorElement>;
  form: UseFormReturn<LoginFormSchema> | UseFormReturn<RecoveryFormSchema>;
} & ForgottenPwLinkParams;
