import type SearchStudents from "@/components/ClassCreation/students/SearchStudents.tsx";
import type { ClassCreationFormSchema } from "@/models/class-creation.models.ts";
import type { SearchStudentsFormSchema } from "@/models/search-students.models.ts";
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
