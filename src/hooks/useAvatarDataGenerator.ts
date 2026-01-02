import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

/**
 * Custom hook to generate avatar data based on form data.
 *
 * @param form - The form instance from react-hook-form.
 * @param formPropertyToWatch - The property name in the form to watch for changes.
 *
 * @returns An array of avatar data objects.
 */
export function useAvatarDataGenerator(
  form: ReturnType<typeof useForm>,
  formPropertyToWatch: string
) {
  const watchedData = useWatch({
    control: form.control,
    name: formPropertyToWatch,
  });

  const dataMemo = useMemo(
    () =>
      (watchedData ?? []).map(([_id, details]: any) => {
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
