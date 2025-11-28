import type { InputItem } from "@/components/Inputs/types/inputs.types";
import type { classCreationSchema } from "@/models/class-creation.models.ts";
import type z from "zod";

export type ClassCreationFormSchema = z.infer<typeof classCreationSchema>;

export type ClassCreationInputItem = InputItem<ClassCreationFormSchema>;
