import type DegreeModule from "@/components/ClassCreation/diploma/degree-module/DegreeModule.tsx";
import type { DegreeModuleFormSchema } from "@/models/degree-module.models";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for DegreeModuleController component
 */
export type DegreeModuleControllerProps = Readonly<{
  formId: string;
  form: UseFormReturn<DegreeModuleFormSchema>;
  className?: string;
  pageId: string;
}> &
  Omit<Parameters<typeof DegreeModule>[0], "modalMode">;
