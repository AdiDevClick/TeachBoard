import type { InputItem } from "@/components/Inputs/types/inputs.types";
import type { pwCreationSchema } from "@/models/password-creation.models.ts";
import type z from "zod";

/**
 * An interface representing a page with input controllers.
 */
export type PasswordCreationFormSchema = z.infer<typeof pwCreationSchema>;

export type PasswordCreationInputItem = InputItem<PasswordCreationFormSchema>;
