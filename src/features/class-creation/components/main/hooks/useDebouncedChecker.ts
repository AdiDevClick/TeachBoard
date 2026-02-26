import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import { useFetch } from "@/hooks/database/fetches/useFetch";
import type { CommandHandlerFieldMeta } from "@/hooks/database/types/use-command-handler.types";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useEffectEvent } from "react";

/**
 * Custom hook to manage debounced availability checks for input names during class creation, utilizing the useFetch hook for API calls and handling command input changes.
 *
 * @param delay - The debounce delay in milliseconds for the availability check API calls. Default is 500ms.
 * @returns An object containing the availability error (if any) and the debounced availability check function to be used in input change handlers.
 */
export function useDebouncedChecker<
  T extends object = object,
  S extends Extract<T, "success"> = Extract<T, "success">,
  E extends Extract<T, "error"> = Extract<T, "error">,
>(delay: number = 500) {
  const { error, fetchParams, setFetchParams, onSubmit } = useFetch<S, E>();

  /**
   * Trigger name availability check when the fetchParams.url changes, which happens after the debounced function sets new params.
   */
  const triggerCheck = useEffectEvent((url: string) => {
    if (!url) return;
    onSubmit();
  });

  /**
   * TRIGGER NAME AVAILABILITY CHECK
   *
   * @description Every time a user types in the class name input
   */
  useEffect(() => {
    triggerCheck(fetchParams.url);
  }, [fetchParams.url]);

  /**
   * Handle changes to the class name input, including debounced API calls to check for name availability.
   *
   * @param event - The change event from the class name input
   * @param meta - Optional metadata for the command handler, including API endpoint information
   */
  const availabilityCheck = useDebounce(
    (rawValue: string, meta?: CommandHandlerFieldMeta) => {
      if (meta?.name !== "name" || !meta.apiEndpoint) return;

      const value = rawValue.trim();
      if (!value) return;

      const computedApiEndpoint =
        typeof meta.apiEndpoint === "function"
          ? meta.apiEndpoint(value)
          : meta.apiEndpoint;

      setFetchParams((prev) => ({
        ...prev,
        url: String(computedApiEndpoint),
        method: "GET",
        contentId: meta.task as FetchParams["contentId"],
        dataReshapeFn: meta.dataReshapeFn,
        silent: true,
      }));
    },
    delay,
  );

  return { availabilityError: error?.available, availabilityCheck };
}
