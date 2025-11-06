import type { inputControllers } from "@/data/loginInputControllers.ts";
import type { formSchema } from "@/models/login.models.ts";
import type { ComponentProps } from "react";
import type z from "zod";

export interface LoginFormData {
  email: string;
  password: string;
}

export type LoginFormSchema = z.infer<typeof formSchema>;

export type InputController = Omit<
  (typeof inputControllers)[number],
  "name"
> & {
  name: keyof LoginFormSchema;
};

export interface LoginFormProps extends ComponentProps<"div"> {
  inputControllers: InputController[];
}
