import type SearchStudents from "@/components/ClassCreation/students/SearchStudents.tsx";
import type { ClassCreationFormSchema } from "@/models/class-creation.models.ts";
import type { SearchStudentsFormSchema } from "@/models/search-students.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import type { UseFormReturn } from "react-hook-form";

export type SearchStudentsControllerProps = Readonly<
  {
    localForm: UseFormReturn<SearchStudentsFormSchema>;
    formId: string;
    pageId: string;
  } & Omit<Parameters<typeof SearchStudents>[0], "modalMode">
>;

export type SearchStudentsProps = Readonly<
  {
    form?: UseFormReturn<ClassCreationFormSchema>;
  } & Omit<PageWithControllers, "inputControllers">
>;
