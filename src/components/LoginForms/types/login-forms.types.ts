import type { useLogin } from "@/hooks/database/login/useLogin.ts";
import type {
  LoginFormSchema,
  LoginInputItem,
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
  pageId?: string;
  className?: string;
  inputControllers?: LoginInputItem[];
  modalMode?: boolean;
  formId?: string;
  form: ReturnType<typeof useForm<LoginFormSchema | RecoveryFormSchema>>;
  setIsPwForgotten: Dispatch<SetStateAction<boolean>>;
  isPwForgotten: boolean;
  textToDisplay: {
    pwForgottenLinkText: string;
    pwForgottenLinkTo: string;
    buttonText: string;
  };
  loginHooks: ReturnType<typeof useLogin>;
};
