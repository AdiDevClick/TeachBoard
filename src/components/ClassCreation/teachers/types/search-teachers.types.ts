import type { SearchPrimaryTeacher } from "@/components/ClassCreation/teachers/SearchTeachers.tsx";
import type { SearchPrimaryTeacherFormSchema } from "@/models/search-teachers.models.ts";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type SearchPrimaryTeacherControllerProps<
  TMainForm extends FieldValues = FieldValues,
  TLocalForm extends FieldValues = SearchPrimaryTeacherFormSchema
> = {
  form: UseFormReturn<TMainForm>;
  localForm: UseFormReturn<TLocalForm>;
  formId: string;
  selectedTeacher?: Array<string>;
} & Omit<Parameters<typeof SearchPrimaryTeacher>[0], "modalMode">;
