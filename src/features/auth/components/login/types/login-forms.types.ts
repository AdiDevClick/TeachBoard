import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type LoginView from "@/features/auth/components/login/LoginView";
import type {
  LoginFormSchema,
  RecoveryFormSchema,
} from "@/features/auth/components/login/models/login.models";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { Dispatch, MouseEvent, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Parameters for handling the recover password click event.
 */
export type HandleRecoverPasswordClickParams = {
  e: MouseEvent<HTMLAnchorElement>;
  isPwForgotten: boolean;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<LoginFormSchema> | UseFormReturn<RecoveryFormSchema>;
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

export type LoginFormControllerProps = Readonly<
  AppControllerInterface<
    LoginFormSchema,
    typeof API_ENDPOINTS.POST.AUTH.LOGIN.endpoint,
    typeof API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape
  > &
    Omit<Parameters<typeof LoginView>[0], "modalMode"> &
    ForgottenPw
>;
