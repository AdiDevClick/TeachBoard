import type { ClassCreationFormSchema } from "@/features/class-creation/components/main/models/class-creation.models";
import type { SearchStudentsFormSchema } from "@/features/class-creation/components/SearchStudents/models/search-students.models";
import type SearchStudents from "@/features/class-creation/components/SearchStudents/SearchStudents.tsx";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import type { UseFormReturn } from "react-hook-form";

export type SearchStudentsControllerProps =
  AppControllerInterface<SearchStudentsFormSchema> &
    Omit<Parameters<typeof SearchStudents>[0], "modalMode"> & {
      localForm: UseFormReturn<SearchStudentsFormSchema>;
    };

export type SearchStudentsProps = Readonly<
  {
    form?: UseFormReturn<ClassCreationFormSchema>;
  } & Omit<PageWithControllers, "inputControllers">
>;
