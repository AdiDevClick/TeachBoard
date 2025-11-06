import type { InputItem } from "@/components/Inputs/types/InputsTypes.ts";
import type { formSchema } from "@/models/login.models.ts";
import type { ComponentProps } from "react";
import type z from "zod";

export interface LoginFormData {
  email: string;
  password: string;
}

export type LoginFormSchema = z.infer<typeof formSchema>;

export type LoginInputItem = InputItem<LoginFormSchema>;

export interface LoginFormProps extends ComponentProps<"div"> {
  inputControllers: LoginInputItem[];
}
