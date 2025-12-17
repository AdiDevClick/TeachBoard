import type DegreeModule from "@/components/ClassCreation/diploma/degree-module/DegreeModule.tsx";
import type { DegreeModuleFormSchema } from "@/models/degree-module.models";
import type { FieldValues, useForm } from "react-hook-form";

/**
 * Props for DegreeModuleController component
 */
export type DegreeModuleProps<T extends FieldValues = DegreeModuleFormSchema> =
  {
    formId: string;
    form: ReturnType<typeof useForm<T>>;
    className?: string;
  } & Omit<Parameters<typeof DegreeModule>[0], "modalMode">;
