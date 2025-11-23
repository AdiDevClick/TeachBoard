import type { InputItem } from "@/components/Inputs/types/InputsTypes.ts";
import { formSchema } from "@/models/login.models.ts";
import type { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import type { ComponentProps } from "react";
import { z } from "zod";

export type LoginFormSchema = z.infer<typeof formSchema>;

export type RecoveryFormSchema = z.infer<typeof pwRecoverySchema>;

export type LoginInputItem = InputItem<LoginFormSchema>;

export interface LoginFormProps extends ComponentProps<"div"> {
  inputControllers: LoginInputItem[];
  modaleMode?: boolean;
}
