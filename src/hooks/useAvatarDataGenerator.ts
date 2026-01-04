import type { ClassCreationExtendedFormSchema } from "@/components/ClassCreation/types/class-creation.types.ts";
import { useMemo } from "react";
import { useWatch, type FieldPath, type UseFormReturn } from "react-hook-form";

/**
 * Custom hook to generate avatar data based on form data.
 *
 * @param form - The form instance from react-hook-form.
 * @param formPropertyToWatch - The property name in the form to watch for changes.
 *
 * @returns An array of avatar data objects.
 */
export function useAvatarDataGenerator(
  form: UseFormReturn<ClassCreationExtendedFormSchema>,
  formPropertyToWatch: Extract<
    FieldPath<ClassCreationExtendedFormSchema>,
    "studentsValues" | "primaryTeacherValue"
  >
) {
  const watchedData = useWatch({
    control: form.control,
    name: formPropertyToWatch,
  });
  const entries = Array.isArray(watchedData) ? watchedData : [];
  const dataMemo = useMemo(
    () =>
      entries.map(([, details]) => {
        const fullName = `${details.firstName || ""} ${
          details.lastName || ""
        }`.trim();
        return {
          src: `https://github.com/${details.firstName}.png`,
          alt: `@${fullName}`,
          fallback:
            (details.firstName?.slice(0, 1).toUpperCase() || "") +
            (details.lastName?.slice(0, 1).toUpperCase() || ""),
        };
      }),
    [watchedData]
  );

  return dataMemo;
}
