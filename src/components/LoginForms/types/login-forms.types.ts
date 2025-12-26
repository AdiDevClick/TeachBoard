import type LoginForm from "@/components/LoginForms/LoginForm.tsx";
import type {
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/models/login.models.ts";
import type { Dispatch, MouseEvent, SetStateAction } from "react";
import type { useForm } from "react-hook-form";

/**
 * Parameters for handling the recover password click event.
 */
export type HandleRecoverPasswordClickParams = {
  e: MouseEvent<HTMLAnchorElement>;
  isPwForgotten: boolean;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
  form: ReturnType<typeof useForm<LoginFormSchema | RecoveryFormSchema>>;
};

/**
 * Props for the LoginFormController component.
 */
export type LoginFormControllerProps = {
  className?: string;
  formId: string;
  form: ReturnType<typeof useForm<LoginFormSchema | RecoveryFormSchema>>;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
  isPwForgotten: boolean;
  textToDisplay: {
    defaultText: string;
    pwForgottenLinkTo: string;
    buttonText: string;
  };
} & Omit<Parameters<typeof LoginForm>[0], "modalMode">;
