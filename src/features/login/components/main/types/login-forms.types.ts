import type LoginForm from "@/features/login/components/main/LoginForm.tsx";
import type {
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/features/login/components/main/models/login.models";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
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

type ForgottenPwLinkParams = {
  isPwForgotten: boolean;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
};

type ForgottenPwAndDefaultLinkTexts = {
  textToDisplay: {
    defaultText: string;
    pwForgottenLinkTo: string;
    buttonText: string;
  };
};

type ForgottenPw = ForgottenPwLinkParams & ForgottenPwAndDefaultLinkTexts;

/**
 * Props for the LoginFormController component.
 */

export type LoginFormControllerProps = AppControllerInterface<
  LoginFormSchema | RecoveryFormSchema
> &
  Omit<Parameters<typeof LoginForm>[0], "modalMode"> &
  ForgottenPw;
