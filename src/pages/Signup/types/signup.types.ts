import type { InputItem } from "@/components/Inputs/types/inputs.types";
import type { useSignupValidation } from "@/hooks/database/signup/email-validation/useSignupValidation.ts";
import type { signupSchema } from "@/models/signup.models.ts";
import type z from "zod";

export type SignupFormSchema = z.infer<typeof signupSchema>;

export type SignupInputItem = InputItem<SignupFormSchema>;

type SignupValidationResponse = {
  success?: boolean;
  token?: string;
  message?: string;
};

export type ValidationState = {
  data?: SignupValidationResponse;
  error?: { message?: string };
};

export type EmailControllerProps = ReturnType<typeof useSignupValidation>;
export type EmailValidationProps = {
  modalMode?: boolean;
  pageId?: string;
};
