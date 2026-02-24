import type { ForgottenPwLinkParams } from "@/features/auth/types/auth-types";
import type { MouseEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Parameters for handling the recover password click event.
 */
export type HandleRecoverPasswordClickParams<T extends FieldValues = FieldValues> = {
  e: MouseEvent<HTMLAnchorElement>;
  form: UseFormReturn<T>;
} & ForgottenPwLinkParams;
