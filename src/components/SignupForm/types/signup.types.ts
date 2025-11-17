import type { InputItem } from "@/components/Inputs/types/InputsTypes.ts";
import { signupSchema } from "@/models/signup.models.ts";
import type { ComponentProps } from "react";
import z from "zod";

export type SignupFormSchema = z.infer<typeof signupSchema>;

export type SignupInputItem = InputItem<SignupFormSchema>;

export type SignupFormProps = ComponentProps<"div"> & {
  inputControllers: SignupInputItem[];
  className?: string;
  modaleMode?: boolean;
};
