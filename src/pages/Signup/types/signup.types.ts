import type { InputItem } from "@/components/Inputs/types/InputsTypes.ts";
import type { signupSchema } from "@/models/signup.models.ts";
import type { HTMLAttributes } from "react";
import type z from "zod";

export type SignupFormSchema = z.infer<typeof signupSchema>;

export type SignupInputItem = InputItem<SignupFormSchema>;

export type EmailValidationProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement>;
