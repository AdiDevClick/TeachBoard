import type DegreeItem from "@/components/ClassCreation/diploma/degree-item/DegreeItem.tsx";
import type { DegreeCreationFormSchema } from "@/models/degree-creation.models.ts";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for the DegreeItemController component.
 *
 * @template T - The type of the form values, extending DegreeCreationFormSchema.
 */
export type DegreeItemControllerProps = Readonly<{
  formId?: string;
  form: UseFormReturn<DegreeCreationFormSchema>;
  className?: string;
}> &
  Omit<Parameters<typeof DegreeItem>[0], "modalMode">;
