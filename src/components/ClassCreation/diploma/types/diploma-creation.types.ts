import type DiplomaCreation from "@/components/ClassCreation/diploma/DiplomaCreation.tsx";
import type { DiplomaCreationFormSchema } from "@/models/diploma-creation.models.ts";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for DiplomaCreationController component
 */
export type DiplomaCreationControllerProps = {
  form: UseFormReturn<DiplomaCreationFormSchema>;
  formId: string;
} & Omit<Parameters<typeof DiplomaCreation>[0], "modalMode">;
