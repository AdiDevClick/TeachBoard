import type { SearchPrimaryTeacher } from "@/components/ClassCreation/teachers/SearchTeachers.tsx";
import type { ClassCreationExtendedFormSchema } from "@/components/ClassCreation/types/class-creation.types.ts";
import type { SearchPrimaryTeacherFormSchema } from "@/models/search-teachers.models.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for the SearchPrimaryTeacherController component.
 */
export type SearchPrimaryTeacherControllerProps = Readonly<
  {
    localForm: UseFormReturn<SearchPrimaryTeacherFormSchema>;
    formId: string;
  } & Omit<Parameters<typeof SearchPrimaryTeacher>[0], "modalMode">
>;

/**
 * Props for the SearchPrimaryTeacher component.
 */
export type SearchPrimaryTeacherProps = Readonly<
  {
    form?: UseFormReturn<ClassCreationExtendedFormSchema>;
  } & Omit<PageWithControllers, "inputControllers">
>;
