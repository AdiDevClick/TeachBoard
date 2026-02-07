import type { pwCreationSchema } from "@/models/password-creation.models.ts";
import type { InputItem } from "@/types/AppInputControllerInterface";
import type z from "zod";

/**
 * An interface representing a page with input controllers.
 */
export type PasswordCreationFormSchema = z.infer<typeof pwCreationSchema>;

export type PasswordCreationInputItem = InputItem<PasswordCreationFormSchema>;
