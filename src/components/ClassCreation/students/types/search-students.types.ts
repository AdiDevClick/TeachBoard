import type SearchStudents from "@/components/ClassCreation/students/SearchStudents.tsx";
import type { SearchStudentsFormSchema } from "@/models/search-students.models.ts";
import type { FieldValues, useForm } from "react-hook-form";

export type SearchStudentsControllerProps<
  T extends FieldValues = SearchStudentsFormSchema
> = {
  form: ReturnType<typeof useForm<T>>;
} & Omit<Parameters<typeof SearchStudents>[0], "modalMode">;
