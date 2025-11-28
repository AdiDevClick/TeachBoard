import type { InputItem } from "@/components/Inputs/types/inputs.types";
import { formSchema } from "@/models/login.models.ts";
import type { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import { z } from "zod";

export type LoginFormSchema = z.infer<typeof formSchema>;

export type RecoveryFormSchema = z.infer<typeof pwRecoverySchema>;

export type LoginInputItem = InputItem<LoginFormSchema>;
