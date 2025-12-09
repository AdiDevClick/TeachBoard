import type DegreeItem from "@/components/ClassCreation/diploma/degree-item/DegreeItem.tsx";
import type { useFetch } from "@/hooks/database/fetches/useFetch.tsx";
import type { DegreeCreationFormSchema } from "@/models/degree-creation.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

/**
 * Props for the DegreeItemController component.
 *
 * @template T - The type of the form values, extending DegreeCreationFormSchema.
 */
export type DegreeItemProps<T extends FieldValues = DegreeCreationFormSchema> =
  {
    formId?: string;
    form: ReturnType<typeof useForm<T>>;
    className?: string;
    fetchHooks: ReturnType<typeof useFetch>;
  } & Omit<Parameters<typeof DegreeItem>[0], "modalMode">;
