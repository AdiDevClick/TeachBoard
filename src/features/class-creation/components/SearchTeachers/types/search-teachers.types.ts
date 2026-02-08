import type { ClassCreationExtendedFormSchema } from "@/features/class-creation";
import type { SearchPrimaryTeacherFormSchema } from "@/features/class-creation/components/SearchTeachers/models/search-teachers.models";
import type { SearchPrimaryTeacher } from "@/features/class-creation/components/SearchTeachers/SearchTeachers.tsx";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for the SearchPrimaryTeacherController component.
 */
export type SearchPrimaryTeacherControllerProps =
  AppControllerInterface<SearchPrimaryTeacherFormSchema> &
    Omit<Parameters<typeof SearchPrimaryTeacher>[0], "modalMode"> & {
      localForm: UseFormReturn<SearchPrimaryTeacherFormSchema>;
    };

/**
 * Props for the SearchPrimaryTeacher component.
 */
export type SearchPrimaryTeacherProps = Readonly<
  {
    form?: UseFormReturn<ClassCreationExtendedFormSchema>;
  } & Omit<PageWithControllers, "inputControllers">
>;
