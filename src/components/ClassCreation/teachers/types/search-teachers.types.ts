import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { SearchPrimaryTeacher } from "@/components/ClassCreation/teachers/SearchTeachers.tsx";
import type { DetailedCommandItem } from "@/components/Command/types/command.types.ts";
import type { ClassCreationFormSchema } from "@/models/class-creation.models.ts";
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
 * Extended form schema to include detailed command items for primary teachers.
 *
 * @remarks This entry is NOT validated as it only serves as a mean of storing detailed command items associated with the primary teacher IDs within the main ClassCreationFormSchema.
 */
export type SearchPrimaryTeacherExtendedForm = ClassCreationFormSchema & {
  primaryTeacherValue?: Map<UUID, DetailedCommandItem>;
};

/**
 * Props for the SearchPrimaryTeacher component.
 */
export type SearchPrimaryTeacherProps = Readonly<
  {
    form?: UseFormReturn<SearchPrimaryTeacherExtendedForm>;
  } & Omit<PageWithControllers, "inputControllers">
>;
