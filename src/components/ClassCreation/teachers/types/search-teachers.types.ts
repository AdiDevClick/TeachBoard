import type { SearchPrimaryTeacher } from "@/components/ClassCreation/teachers/SearchTeachers.tsx";
import type { SearchPrimaryTeacherFormSchema } from "@/models/search-teachers.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

export type SearchPrimaryTeacherControllerProps<
  T extends FieldValues = SearchPrimaryTeacherFormSchema
> = {
  form: ReturnType<typeof useForm<T>>;
  localForm: ReturnType<typeof useForm<T>>;
  formId: string;
  selectedTeacher?: Array<string>;
} & Omit<Parameters<typeof SearchPrimaryTeacher>[0], "modalMode">;
