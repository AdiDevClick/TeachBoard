import type { SearchTeachers } from "@/components/ClassCreation/teachers/SearchTeachers.tsx";
import type { SearchTeachersFormSchema } from "@/models/search-teachers.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

export type SearchTeachersControllerProps<
  T extends FieldValues = SearchTeachersFormSchema
> = {
  form: ReturnType<typeof useForm<T>>;
  localForm: ReturnType<typeof useForm<T>>;
  formId: string;
  selectedTeacher?: Array<string>;
} & Omit<Parameters<typeof SearchTeachers>[0], "modalMode">;
