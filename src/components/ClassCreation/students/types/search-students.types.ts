import type SearchStudents from "@/components/ClassCreation/students/SearchStudents.tsx";
import type { SearchStudentsFormSchema } from "@/models/search-students.models.ts";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type SearchStudentsControllerProps<
  TMainForm extends FieldValues = FieldValues,
  TLocalForm extends FieldValues = SearchStudentsFormSchema
> = {
  form: UseFormReturn<TMainForm>;
  localForm: UseFormReturn<TLocalForm>;
  formId: string;
  selectedStudents?: Array<string>;
} & Omit<Parameters<typeof SearchStudents>[0], "modalMode">;
