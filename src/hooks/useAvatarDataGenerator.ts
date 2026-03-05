import { useMemo } from "react";

/**
 * Custom hook to generate avatar data based on form data.
 *
 * @param form - The form instance from react-hook-form.
 * @param formPropertyToWatch - The property name in the form to watch for changes.
 *
 * @returns An array of avatar data objects.
 */
export function useAvatarDataGenerator(values: any[] | undefined) {
  const dataMemo = useMemo(
    () =>
      (values ?? []).map(([, details]) => {
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
    [values],
  );

  return dataMemo;
}
